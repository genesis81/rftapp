frappe.ui.form.on('Purchase Order', {
    refresh(frm) {
        if (frm.doc.docstatus === 0) {
            frm.add_custom_button(__("Order Planning"), function() {
                if (frm.doc.supplier) {
                    get_items_from_order_planning(frm);
                }
            }, __("Get items from"));
        }
    }
});

// this function will get all items that have negative projected quanitites for the selected supplier
function get_items_from_order_planning(frm) {
    var filters = {'supplier': frm.doc.supplier};
    frappe.call({
        "method": "rtfapp.rheintaler_turnfest.report.order_planning.order_planning.get_data",
        "args": {
            "filters": filters
        },
        "callback": function(response) {
            var data = response.message;
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var child = cur_frm.add_child('items');
                    frappe.model.set_value(child.doctype, child.name, 'item_code', data[i].item_code);
                    frappe.model.set_value(child.doctype, child.name, 'qty', (data[i].to_order));
                }
                cur_frm.refresh_field('items');
                frappe.show_alert(__("Updated"));
            } 
        }
    });
}
