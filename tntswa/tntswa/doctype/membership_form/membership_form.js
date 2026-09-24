// Copyright (c) 2025, TNTSWA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Membership Form", {
    refresh: function(frm) {
        frm.set_df_property("shop_place", "label", "ஊர்");
        frm.set_df_property("taluk", "label", "தாலுகா");
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

        // Field name example: special_field
        if (allowed_users.includes(frappe.session.user)) {
            frm.set_df_property("add_sign", "hidden", 0);
            frm.set_df_property("add_president_sign", "hidden", 0);
        } else {
            frm.set_df_property("add_sign", "hidden", 1);
            frm.set_df_property("add_president_sign", "hidden", 1);
        }
        if(!frm.doc.__islocal && frm.doc.workflow_state == "Pending for State General Manager" && allowed_users.includes(frappe.session.user)){
            frm.add_custom_button(__('Add Signature'), () => {

                let general_img = "/files/State General.png";

                // State General signature
                fetch(general_img)
                    .then(res => res.blob())
                    .then(blob => {
                        let reader = new FileReader();
                        reader.onloadend = function () {

                            frm.set_value('state_general_manager_sign', reader.result);
                            frm.set_value('state_general', general_img);

                            frm.save();

                            // State President signature
                        };
                        reader.readAsDataURL(blob);
                    });

            });
        }
        if(!frm.doc.__islocal && frm.doc.workflow_state == "Pending for State President" && allowed_users.includes(frappe.session.user)){
            frm.add_custom_button(__('Add Signature'), () => {

                let president_img = "/files/State Manager.png";

                // State General signature
                fetch(president_img)
                .then(res => res.blob())
                .then(blob2 => {
                    let reader2 = new FileReader();
                    reader2.onloadend = function () {

                        frm.set_value('state_president_signature', reader2.result);
                        frm.set_value('state_president', president_img);

                        frm.save();
                    };
                    reader2.readAsDataURL(blob2);
                });

            });
        }
        if(!frm.doc.__islocal && frm.doc.docstatus!=2){
	        frm.add_custom_button(__("Membership Form"), function () {
			var f_name = frm.doc.name
			var print_format = "Membership Form";
			window.open(frappe.urllib.get_full_url("/api/method/frappe.utils.print_format.download_pdf?"
				+ "doctype=" + encodeURIComponent("Membership Form")
				+ "&name=" + encodeURIComponent(f_name)
				+ "&trigger_print=1"
				+ "&format=" + print_format
				+ "&no_letterhead=0"
			));
		},__("Actions"));
        frm.add_custom_button(__("ID Card"), function () {
			var f_name = frm.doc.name
			var print_format = "ID Card Print Format";
			window.open(frappe.urllib.get_full_url("/api/method/frappe.utils.print_format.download_pdf?"
				+ "doctype=" + encodeURIComponent("Membership Form")
				+ "&name=" + encodeURIComponent(f_name)
				+ "&trigger_print=1"
				+ "&format=" + print_format
				+ "&no_letterhead=0"
			));
		},__("Actions"));
        frm.add_custom_button(__('Payment'), function() {

            frappe.route_options = {
                membership_id: frm.doc.name,
                district: frm.doc.district,
                member_name: frm.doc.name1,
                payment_type: "வரவு",
                payment_from: "உறுப்பினர்"
            };

            frappe.set_route('Form', 'Payment', 'new');

        },__('Actions'));
        }
        
        

       
    },
    // after_save: function(frm) {
    //     frm.refresh_field("sign");

    //     setTimeout(() => {
    //         fix_signature_width(frm);
    //     }, 300);
    // },
    add_sign: function(frm){
        let general_img = "/files/State General.png";

        // State General signature
        fetch(general_img)
            .then(res => res.blob())
            .then(blob => {
                let reader = new FileReader();
                reader.onloadend = function () {

                    frm.set_value('state_general_manager_sign', reader.result);
                    frm.set_value('state_general', general_img);

                    frm.save();

                    // State President signature
                };
                reader.readAsDataURL(blob);
            });

    },
    add_sign: function(frm){
        let general_img = "/files/State General.png";

        // State General signature
        fetch(general_img)
            .then(res => res.blob())
            .then(blob => {
                let reader = new FileReader();
                reader.onloadend = function () {

                    frm.set_value('state_general_manager_sign', reader.result);
                    frm.set_value('state_general', general_img);

                    frm.save();

                    // State President signature
                };
                reader.readAsDataURL(blob);
            });

    },
    add_president_sign: function(frm){
            let president_img = "/files/State Manager.png";

                // State General signature
                fetch(president_img)
                .then(res => res.blob())
                .then(blob2 => {
                    let reader2 = new FileReader();
                    reader2.onloadend = function () {

                        frm.set_value('state_president_signature', reader2.result);
                        frm.set_value('state_president', president_img);

                        frm.save();
                    };
                    reader2.readAsDataURL(blob2);
                });
    },


    date_of_birth: function(frm) {
        if (frm.doc.date_of_birth) {
            let dob = new Date(frm.doc.date_of_birth);
            let today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            let m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            frm.set_value("age", age);
        }
    },
    is_same_as_phone_no(frm){
        if (frm.doc.is_same_as_phone_no == 1){
            frm.set_value("whatsapp_no",frm.doc.phone_no);
        }else{
            frm.set_value("whatsapp_no", "");
        }
    },

//     signature: function(frm) {

//     let sign_img = frm.doc.signature;

//     if (sign_img) {

//         fetch(sign_img)
//             .then(res => res.blob())
//             .then(blob => {

//                 let reader = new FileReader();

//                 reader.onloadend = function () {

//                     frm.set_value("sign", reader.result);

//                     frm.refresh_field("sign");

//                     frm.dirty = false;
//                 };

//                 reader.readAsDataURL(blob);
//             });
//     }
// }
        signature: function(frm) {

            let sign_img = frm.doc.signature;

            if (sign_img) {

                fetch(sign_img)
                    .then(res => res.blob())
                    .then(blob => {

                        let reader = new FileReader();

                        reader.onloadend = async function () {

                            await frm.set_value(
                                "sign",
                                reader.result
                            );

                            frm.refresh_field("sign");

                            await frm.save();
                        };

                        reader.readAsDataURL(blob);
                    });
            }
        },
 
});


function fix_signature_width(frm) {

    let signature_fields = [
        "state_president_signature",
        "sign",
        "state_general_manager_sign"
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
