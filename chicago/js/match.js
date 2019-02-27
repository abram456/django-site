function open_close_visit(obj) {
    id = $(obj).attr('data-id');
    url = $(obj).attr('data-url');
    Pace.restart();
    Pace.track(function () {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            url: "/"+url,
            success: function (response) {
                try {
                    response = jQuery.parseJSON(response);
                } catch {}
                if (response.status!='OK') {
                    toastr.error(response.msg);
                    return;
                }
                if ($(obj).attr('closed')==1) {
                    $('.close_visit').removeClass('hide');
                    $('.reopen_visit').addClass('hide');
                    $('.closeit').removeClass('vclosed');
                    $('.openit').addClass('hide');
                } else if ($(obj).attr('closed')==0) {
                    $('.reopen_visit').removeClass('hide');
                    $('.close_visit').addClass('hide');
                    $('.closeit').addClass('vclosed');
                    $('.openit').removeClass('hide');
                }

                toastr.success(response.msg);
                return;
            } 
        });
    })
}
function filter_volunteers() {
    id = $('#visit_id').val();
    languages = [];
    neighborhoods = [];
    interests = [];
    i=0;
    $("input[name='languages[]']:checked").each(function(){
        languages.push($(this).val());
    })
    i=0;
    $("input[name='neighborhoods[]']:checked").each(function(){
        neighborhoods[i++] = $(this).val();
    })
    i=0;
    $("input[name='interests[]']:checked").each(function(){
        interests[i++] = $(this).val();
    })

    Pace.restart();
    Pace.track(function () {
        $.ajax({
            type: 'POST',
            data: {
                id: id,
                model: "Visit",
                languages: languages,
                neighborhoods: neighborhoods,
                interests: interests,
            },
            url: "/admin/volunteer/match_filter_volunteers",
            success: function (response) {
                try {
                    response = jQuery.parseJSON(response);
                } catch {}
                if (response.status=='ERROR') {
                    toastr.error(response.msg);
                    return;
                }
                $("#volunteers_block").html(response);
            } 
        });
    })
}

function filter_volunteers_by_name() {
    id = $('#visit_id').val();
    volunteer_name = $('#volunteer_name').val();
    if(volunteer_name.length<=0) {
        return false;
    }

    Pace.restart();
    Pace.track(function () {
        $.ajax({
            type: 'POST',
            // dataType: 'json',
            data: {
                id: id,
                model: "Visit",
                volunteer_name: volunteer_name,
            },
            url: "/admin/volunteer/match_filter_volunteers",
            success: function (response) {
                try {
                    response = jQuery.parseJSON(response);
                } catch {}
                if (response.status=='ERROR') {
                    toastr.error(response.msg);
                    return;
                }
                $("#volunteers_block1").html(response);
            } 
        });
    })
}

function match_action(obj) {
    volunteer_id = $(obj).attr('data-volunteer-id');
    visit_id = $('#visit_id').val();
    url = $(obj).attr('data-url');
    match_datetime = $('#confirmed_date').val();
    from = '';
    cc = '';
    bcc = '';
    subject = '';
    content = '';
    if (volunteer_id==''||volunteer_id==undefined) {
        volunteer_id = $(obj).parent().prev().find('input[name=volunteer]').val();
        from = $(obj).parent().prev().find('select[name=admin_emails] > option:selected').val();
        cc = $(obj).parent().prev().find('input[name=cc]').val();
        bcc = $(obj).parent().prev().find('input[name=bcc]').val();
        subject = $(obj).parent().prev().find('input[name=message_subject]').val();
        content = $(obj).parent().prev().find('textarea[name=message_content]').val();
        url = 'admin/visit/ajax_update/'+$(obj).attr('action');
    }

    Pace.restart();
    Pace.track(function () {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                id: visit_id,
                volunteer_id: volunteer_id,
                match_datetime: match_datetime,
                from: from,
                cc: cc,
                bcc: bcc,
                subject: subject,
                content: content,
            },
            url: "/"+url,
            success: function (response) {
                try {
                    response = jQuery.parseJSON(response);
                } catch {}
                if (response.status!='OK') {
                    toastr.error(response.msg);
                    return;
                }

                if (response.vstatus=='Assigned') {
                    $('.unassign-'+response.volunteer_id).removeClass('hide');
                    $('.assign-'+response.volunteer_id).addClass('hide');
                } else if (response.vstatus=='Unassigned') {
                    $('.assign-'+response.volunteer_id).removeClass('hide');
                    $('.unassign-'+response.volunteer_id).addClass('hide');
                } else if (response.vstatus=='Invited') {
                    $('.uninvite-'+response.volunteer_id).removeClass('hide');
                    $('.invite-'+response.volunteer_id).addClass('hide');
                } else if (response.vstatus=='Declined') {
                    $('.invite-'+response.volunteer_id).removeClass('hide');
                    $('.uninvite-'+response.volunteer_id).addClass('hide');
                }

                var table_id = $('.row-'+response.volunteer_id).parent().parent().attr('id');
                if((table_id=='volunteer_list'||table_id=='volunteer_list1')&&($(obj).attr('action') != 'contact')) {
                    var row = $('.row-'+response.volunteer_id).html();
                    $('.row-'+response.volunteer_id).fadeOut();
                    $('#current_volunteer_list tbody').prepend('<tr>'+row+'</tr>');
                    $('html, body').animate({
                        scrollTop: $("#current_volunteer_list").offset().top-150
                    }, 500);
                    bind_match_buttons();
                    location.href = "/admin/visit/match/"+id;
                }

                $('.status-'+response.volunteer_id).html(response.vstatus);
                $('.close').click()

                toastr.success(response.msg);
                return;
            } 
        });
    })
}

//To confirm/Unconfirm the date
function updateVisit(obj) {
    id = $(obj).attr('data-id');
    confirmed_date = $('#confirmed_date').val();
    url = $(obj).attr('data-url');
    Pace.restart();
    Pace.track(function () {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                id: id,
                confirmed_date: confirmed_date
            },
            url: "/"+url,
            success: function (response) {
                try {
                    response = jQuery.parseJSON(response);
                } catch {}
                if (response.status!='OK') {
                    toastr.error(response.msg);
                    return;
                }
                if ($(obj).attr('confirmed')==1) {
                    if ($('#confirmed_date option:selected').text().indexOf('CONFRIMED')<0) {
                        $('#confirmed_date option:selected').text($('#confirmed_date option:selected').text()+'(CONFRIMED)');
                    }
                    $('#unconfirm_date').removeClass('hide');
                    location.href = "/admin/visit/match/"+id;
                } else if($(obj).attr('confirmed')==0) {
                    $('#confirmed_date option:selected').text($('#confirmed_date option:selected').text().split('(')[0]);
                    $('#unconfirm_date').addClass('hide');
                    location.href = "/admin/visit/match/"+id;
                }
                toastr.success(response.msg);
                return;
            } 
        });
    })
}

$(document).ready(function() {
     $(".read-more").click(function(){
        $(".group-info").toggleClass('show');
        $(".read-more i").toggleClass('hide');
    });
    setTimeout(function(){
        filter_volunteers();
        $('#current_volunteer_list').DataTable({
            'paging'      : false,
            'lengthChange': false,
            'searching'   : false,
            'ordering'    : false,
            'info'        : false,
            'autoWidth'   : true
        })
    },500)

    bind_match_buttons();
    // CKEDITOR.replace('message_content');
    // CKEDITOR.replace('message_content1');
    // CKEDITOR.replace('message_content2');
});

function bind_match_buttons() {
    
    var modal_template = {
        modal: true
    };
    var visit_id = $('#visit_id').val();

    $('.match_volunteer_action_assign').unbind('click').click(function(event) {
        event.preventDefault();
        
         var volunteer_name = $(this).parent().siblings("td").first().children('a').html();
        var volunteer_id = $(this).attr('data-volunteer-id');
        var match_datetime = $("#confirmed_date").val();

        var context_string = 'Visit|' + id + '||Volunteer|' + volunteer_id;
        var subject_field = $("#assign_modal input[name='message_subject']");
        var message_field = $("#assign_modal textarea[name='message_content']");
        
        // get the email template subject and message, parsed with the context string
        // and put their values into the input fields
        populate_parsed_email_template(
            'volunteer_assign', 
            context_string, 
            subject_field, 
            message_field
        );
        
        $('#assign_modal').find('span.volunteer_name').text(volunteer_name);
        $('#assign_modal').find("input[name='volunteer']").attr('value', volunteer_id);
        $('#assign_modal').find("input[name='match_datetime']").attr('value', match_datetime);
        $('#assign_modal').modal();
        
    });

    $('.match_volunteer_action_invite').unbind('click').click(function(event) {
        event.preventDefault();     
        
         var volunteer_name = $(this).parent().siblings("td").first().children('a').html();
        var volunteer_id = $(this).attr('data-volunteer-id');
        
        var context_string = 'Visit|' + id + '||Volunteer|' + volunteer_id;
        var subject_field = $("#invite_modal input[name='message_subject']");
        var message_field = $("#invite_modal textarea[name='message_content']");
        
        // get the email template subject and message, parsed with the context string
        // and put their values into the input fields
        populate_parsed_email_template(
            'volunteer_invitation', 
            context_string, 
            subject_field, 
            message_field
        );

        
        // if there's a confirmed date, that's the match date/time.  If not, it's the date/time of the 
        // clicked date/time preference
        if ($("#confirmed_date").text()) {
            match_datetime = $("#confirmed_date").text();
        } else {
            match_datetime = $(this).parent("td").prev('td').children('span.visit_preference_date_time').text();
        }
        
        $('#invite_modal').find('span.volunteer_name').text(volunteer_name);
        $('#invite_modal').find("input[name='volunteer']").attr('value', volunteer_id);
        $('#invite_modal').find("input[name='match_datetime']").attr('value', match_datetime);
        $('#invite_modal').modal();
        
    }); 
    
    $('.match_volunteer_action_contact').unbind('click').click(function(event) {
        
        event.preventDefault();     
        
        var volunteer_name = $(this).parent().siblings("td").first().children('a').html();
        var volunteer_id = $(this).attr('data-volunteer-id');
        
        var context_string = 'Visit|' + id + '||Volunteer|' + volunteer_id;
        var subject_field = $("#contact_modal input[name='message_subject']");
        var message_field = $("#contact_modal textarea[name='message_content']");
        
        // get the email template subject and message, parsed with the context string
        // and put their values into the input fields
        populate_parsed_email_template(
            'volunteer_contact', 
            context_string, 
            subject_field, 
            message_field
        );
        $('#contact_modal').find('span.volunteer_name').text(volunteer_name);
        $('#contact_modal').find("input[name='volunteer']").attr('value', volunteer_id);
        $('#contact_modal').modal();
    }); 
    
    $('.confirm_visit_visitor').unbind('click').click(function(event) {
    
        event.preventDefault();

        var context_string = 'Visit|' + id;
        var subject_field = $("#confirm_visitor_modal input[name='message_subject']");
        var message_field = $("#confirm_visitor_modal textarea[name='message_content']");
        
        // get the email template subject and message, parsed with the context string
        // and put their values into the input fields
        populate_parsed_email_template(
            'visitor_confirm', 
            context_string, 
            subject_field, 
            message_field
        );

        $('#confirm_visitor_modal').modal();
        
    });

    $('.view-volunteer').unbind('click').click(function(event) {
    
        event.preventDefault();

        var volunteer_id = $(this).attr('data-volunteer-id');

        $('#volunteer_modal').modal();
        $('#volunteer_modal .modal-body').html("<div class='quick-ajax' style='margin-top:-20px;' data-url='/admin/volunteer/"+volunteer_id+"'>Loading...</div>");
        $('#volunteer_modal .modal-title').html($(this).html());
        initScripts();
        
    });

    // any button inside the generic modal will close it
    $("#generic_modal input[type='button']").unbind('click').click(function(event) {
        $("#generic_modal").dialog('close');
    });

    $('.action-save').unbind('click').click(function(event) {
        match_action(this);
    });
    $('#available_email_templates').unbind('change').change(function(){
        event.preventDefault();

        template = $(this).val();

        var context_string = 'Visit|' + id;
        var subject_field = $("#contact_visitor_modal input[name='message_subject']");
        var message_field = $("#contact_visitor_modal textarea[name='message_content']");
        
        // get the email template subject and message, parsed with the context string
        // and put their values into the input fields
        populate_parsed_email_template(
            template, 
            context_string, 
            subject_field, 
            message_field
        );
    })
}