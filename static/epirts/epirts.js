/*
 * Epirts.js
 * Free software replacement for Stripe.js implementing a subset of the
 * Stripe.js API
 *
 * @licstart  The following is the entire license notice for the
 * JavaScript code in this file.
 *
 * Copyright (C) 2015  Libiquity LLC
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g. minimized or compacted) forms of
 * this program without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 */

var Stripe = Epirts = (function() {
	var pub = {};
	var _key = undefined;

	/* Stripe.js API version */
	pub.version = 2;

	pub.endpoint = 'https://api.stripe.com/v1';

	pub.card = (function() {
		var pub = {};

		var _properties = ['number', 'exp_month', 'exp_year',
			'cvc', 'name', 'address_line1', 'address_line2',
			'address_city', 'address_state', 'address_zip',
			'address_country'];
		var _cb_time = (new Date()).getTime();

		pub.createToken = function(data, arg2, arg3) {
			var callback;
			var amount;
			var where;
			var script;
			var func;
			var url;
			var i;
			var prop;

			if (!data || typeof data !== 'object') {
				throw new Error("Invalid card");
			} else if (_key === undefined) {
				throw new Error("Publishable key not set");
			}
			if (typeof arg2 === 'function') {
				callback = arg2;
			} else if (typeof arg2 === 'number' ||
					typeof arg2 === 'string') {
				amount = arg2;
				callback = arg3;
			}

			where = document.getElementsByTagName('script')[0];
			script = document.createElement('script');
			script.type = 'text/javascript';
			script.async = true;

			func = 'sjsonp' + ++_cb_time;
			window[func] = function(response, status) {
				callback(status, response);
				script.parentNode.removeChild(script);
			}

			url = Epirts.endpoint + '/tokens?';
			for (i = 0; i < _properties.length; ++i) {
				prop = _properties[i];
				if (data.hasOwnProperty(prop)) {
					url += 'card[' + prop + ']=' +
						data[prop] + '&';
				}
			}
			if (amount !== undefined) {
				url += 'amount=' + amount + '&';
			}
			url += 'key=' + _key;
			url += '&callback=' + func;
			url += '&_method=POST';
			script.src = url;

			where.parentNode.insertBefore(script, where);
		};

		pub.validateCardNumber = function(number) {
			number = (number + '').replace(/\s|-/g);
			if (number.match(/\D/)) {
				return false;
			} else if (number.length < 13 || number.length > 16) {
				/* Card number lengths:
				 *   * Visa: 13 or 16
				 *   * MasterCard: 16
				 *   * American Express: 15
				 *   * JCB: 16
				 *   * Discover: 16
				 *   * Diners Club: 14-16
				 */
				return false;
			} else if (!pub.luhnCheck(number)) {
				return false;
			}
			return true;
		};

		pub.luhnCheck = function(number) {
			var i;
			var digit;
			var sum;

			number += '';
			sum = 0;
			for (i = 0; i < number.length; ++i) {
				digit = number.charAt(number.length - 1 - i);
				digit = parseInt(digit);
				digit *= i % 2 + 1;
				if (digit > 9) {
					digit -= 9;
				}
				sum += digit;
			}
			return sum % 10 === 0;
		};

		pub.validateExpiry = function(month, year) {
			var today;

			today = new Date();
			month = parseInt(month, 10);
			year = parseInt(year, 10);
			if (isNaN(month) || isNaN(year)) {
				return false;
			} else if (month < 1 || month > 12) {
				return false;
			} else if (year < today.getFullYear()) {
				return false;
			} else if (year === today.getFullYear() &&
					month <= today.getMonth()) {
				return false;
			}
			return true;
		};

		pub.validateCVC = function(cvc) {
			cvc += '';
			if (cvc.match(/\D/)) {
				return false;
			} else if (cvc.length < 3 || cvc.length > 4) {
				return false;
			}
			return true;
		};

		pub.cardType = function(number) {
			var p;
			var i;

			/* Approximate IIN prefixes */
			p = {};
			for (i = 40; i <= 49; ++i) p[i] = 'Visa';
			for (i = 51; i <= 55; ++i) p[i] = 'MasterCard';
			p[34] = p[37] = 'American Express';
			p[35] = 'JCB';
			p[60] = p[62] = p[64] = p[65] = 'Discover';
			p[30] = p[36] = p[38] = p[39] = 'Diners Club';

			return p[(number + '').slice(0, 2)] || 'Unknown';
		};

		return pub;
	}());

	pub.setPublishableKey = function(key) {
		if (typeof key !== 'string') {
			throw new Error('Invalid publishable key');
		}
		if (!key.match(/^pk_(test|live)_[A-Za-z0-9]+/)) {
			throw new Error('Invalid publishable key');
		}
		_key = key;
	};

	return pub;
}());
