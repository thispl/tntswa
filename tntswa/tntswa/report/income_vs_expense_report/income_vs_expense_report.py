# Copyright (c) 2025, TNTSWA and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    return columns, data


def get_columns():
    return [
        {
            "label": _("Date"),
            "fieldname": "date",
            "fieldtype": "Date",
            "width": 150
        },
        {
            "label": _("Payment Type"),
            "fieldname": "payment_type",
            "fieldtype": "Data",
            "width": 250
        },
        {
            "label": _("Amount"),
            "fieldname": "amount",
            "fieldtype": "Currency",
            "width": 150
        }
    ]


def get_data(filters):
    conditions = ""
    values = {}

    if filters and filters.get("from_date"):
        conditions += " AND posting_date >= %(from_date)s"
        values["from_date"] = filters["from_date"]

    if filters and filters.get("to_date"):
        conditions += " AND posting_date <= %(to_date)s"
        values["to_date"] = filters["to_date"]
    
    if filters and filters.get("payment_type"):
        conditions += " AND payment_type = %(payment_type)s"
        values["payment_type"] = filters["payment_type"]

    query = f"""
        SELECT
            posting_date AS date,
            payment_type,
            CASE
                WHEN payment_type = 'வரவு' THEN amount
                ELSE amount * -1
            END AS amount
        FROM `tabPayment`
        WHERE docstatus != 2
        {conditions}
        ORDER BY posting_date
    """

    return frappe.db.sql(query, values, as_dict=True)
