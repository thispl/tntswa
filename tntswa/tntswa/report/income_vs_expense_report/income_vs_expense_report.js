// Copyright (c) 2025, TNTSWA and contributors
// For license information, please see license.txt

frappe.query_reports["Income Vs Expense Report"] = {
	"filters": [
        {
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Date"
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
            "fieldtype": "Date"
        },
        {
            "fieldname": "payment_type",
            "label": __("Payment Type"),
            "fieldtype": "Select",
            "options":[" ","வரவு","செலவு"]
        },
        
    ]
};
