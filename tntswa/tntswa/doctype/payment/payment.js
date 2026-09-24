// Copyright (c) 2025, TNTSWA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Payment", {
	refresh(frm) {
        if (frm.doc.state_in_charge_signature) {
            frm.refresh_field("state_in_charge_signature");
        }

        if (frm.doc.district_in_charge_signature) {
            frm.refresh_field("district_in_charge_signature");
        }
        fix_signature_width(frm);
        let allowed_users = [
            "statecenter1@tntswa.com",
            "statecenter2@tntswa.com",
            "statecenter3@tntswa.com",
            "statecenter4@tntswa.com",
            "statecenter5@tntswa.com",
            "statecenter6@tntswa.com",
            "bhuvaneswari.a@groupteampro.com"
        ];
        if(!frm.doc.__islocal && frm.doc.docstatus!=2 && allowed_users.includes(frappe.session.user)){
	        frm.add_custom_button(__("Donations Receipt"), function () {
			var f_name = frm.doc.name
			var print_format = "Donation Print New";
			window.open(frappe.urllib.get_full_url("/api/method/frappe.utils.print_format.download_pdf?"
				+ "doctype=" + encodeURIComponent("Payment")
				+ "&name=" + encodeURIComponent(f_name)
				+ "&trigger_print=1"
				+ "&format=" + print_format
				+ "&no_letterhead=0"
			));
		},__("Actions"));
        }
        if(!frm.doc.__islocal && frm.doc.docstatus!=2 && !allowed_users.includes(frappe.session.user)){
                frm.add_custom_button(__("Donation Receipt"), function () {
                var f_name = frm.doc.name
                var print_format = "Donation Print Format new 1";
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
    },

    add_district_in_charge_sign: function(frm) {

            let sign_img = frm.doc.add_district_in_charge_sign;

            if (sign_img) {

                fetch(sign_img)
                    .then(res => res.blob())
                    .then(blob => {

                        let reader = new FileReader();

                        reader.onloadend = async function () {

                            await frm.set_value(
                                "district_in_charge_signature",
                                reader.result
                            );

                            frm.refresh_field("district_in_charge_signature");

                            await frm.save();
                        };

                        reader.readAsDataURL(blob);
                    });
            }
        },
    after_save: function(frm) {

        setTimeout(() => {
            fix_signature_width(frm);
        }, 300);
    },
    add_state_in_charge_sign: function(frm) {
        let sign_img = frm.doc.add_state_in_charge_sign;

        if (!sign_img) return;

        setTimeout(() => {
            fetch(sign_img)
                .then(res => res.blob())
                .then(blob => {
                    let reader = new FileReader();

                    reader.onloadend = function () {
                        frm.set_value("state_in_charge_signature", reader.result);
                        setTimeout(() => {
                            frm.refresh_field("state_in_charge_signature");
                            frm.save();
                        }, 100);
                        
                    };

                    reader.readAsDataURL(blob);
                });
        }, 200);
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

                canvas.css({
                    width: width + "px",
                    maxWidth: "100%"
                });
            }
        }, 300);
    });
}
