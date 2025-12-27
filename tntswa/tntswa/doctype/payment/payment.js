// Copyright (c) 2025, TNTSWA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Payment", {
	refresh(frm) {
        fix_signature_width(frm);
        if(!frm.doc.__islocal && frm.doc.docstatus!=2){
	        frm.add_custom_button(__("Donations Receipt"), function () {
			var f_name = frm.doc.name
			var print_format = "Donation Print";
			window.open(frappe.urllib.get_full_url("/api/method/frappe.utils.print_format.download_pdf?"
				+ "doctype=" + encodeURIComponent("Payment")
				+ "&name=" + encodeURIComponent(f_name)
				+ "&trigger_print=1"
				+ "&format=" + print_format
				+ "&no_letterhead=0"
			));
		},__("Actions"));
    }
	frm.set_query('membership_id', function () {
            return {
                filters: {
                    docstatus: ['!=', 2]
                }
            };
        });

	},
	validate(frm) {
        if (frm.doc.posting_date > frappe.datetime.get_today()) {
            frappe.throw(__('Payment Date cannot be a future date'));
        }
    },
	amount: function(frm) {
        if (frm.doc.amount) {
            frm.set_value(
                'amount_in_words',
                frappe.utils.money_in_words(frm.doc.amount)
            );
        } else {
            frm.set_value('amount_in_words', '');
        }
    }
});


function fix_signature_width(frm) {

    let signature_fields = [
        "district_in_charge_signature",
        "state_in_charge_signature"
    ];

    signature_fields.forEach(fieldname => {
        if (!frm.fields_dict[fieldname]) return;

        setTimeout(() => {
            let wrapper = frm.fields_dict[fieldname].$wrapper;
            let canvas = wrapper.find("canvas");

            if (canvas.length) {
                let width = wrapper.width();

                canvas.attr("width", width);
                canvas.css({
                    width: width + "px",
                    maxWidth: "100%"
                });
            }
        }, 600);
    });
}
