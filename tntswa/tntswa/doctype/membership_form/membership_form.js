// Copyright (c) 2025, TNTSWA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Membership Form", {
    refresh: function(frm) {
        fix_signature_width(frm);
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
        frappe.db.get_value("User", { "name": user }, "language")
        .then(function(r) {
            var lang = r.message.language;
            if (lang === "ta") {
                frm.set_df_property("date_of_joining", "label", "பணியில் சேர்ந்த நாள்");

            }
        });
        

       
    },
    after_save(frm){
        frm.trigger("refresh");

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
    after_save(frm){
        if(frm.doc.sign){
            frm.set_df_property("sign","read_only","1")
        }
    },
    

 
});

function fix_signature_width(frm) {

    let signature_fields = [
        "state_president_signature",
        "sign" ,  // 2nd field name
        "state_general_manager_sign"
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
