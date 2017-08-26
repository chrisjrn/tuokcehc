/*
 * Tuokcehc.js -- iframe-support.js
 * Free software replacement for Stripe Checkout based on epirts.js
 *
 * @licstart  The following is the entire license notice for the
 * JavaScript code in this file.
 *
 * Copyright (C) 2017  Christopher Neugebauer
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


function onFormSubmit(event) {
    $form = $("#paymentform");

    $form.find('button[role=submit]').prop('disabled', true); // Re-enable submission

    fields = [
        'number', 'exp_month', 'exp_year', 'cvc', 'name',
        'address_line1', 'address_line2', 'address_city',
        'address_state', 'address_zip', 'address_country'
    ];

    values = Object();
    for (i = 0; i < fields.length; i++) {
        name = fields[i];
        values[name] = $form.find("input[name="+ fields[i] +"]").val();
    }

    Epirts.card.createToken(values, stripeResponseHandler);

    event.preventDefault();
    return false;
}

function stripeResponseHandler(status, response) {

  $form = $("#paymentform");

  if (response.error) { // Problem!
        // Show the errors on the form
        console.log(response.error.message);
        $form.find('button').prop('disabled', false); // Re-enable submission
        $form.find('#payment-errors').text(response.error.message);
        $form.find('#payment-errors').show();

    } else {
        // Token was created!

        // Get the token ID:
        var token = response.id;
        parent.postMessage({"token": token}, window.referrer);
    }
}
