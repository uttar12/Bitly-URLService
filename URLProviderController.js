//https://dev.bitly.com/api-reference#getClicksSummaryForBitlink
$(function () {
    var urlLoc = 'https://api-ssl.bitly.com/';
    var username = "uttar12";
    var key = "R_81ba81fd3eea4279b0fd170510679146";
    var accessToken = "b4dcbeb4d16bfe60b41930d0bf3e5abda1ce8fdd";

    $('#divMessage').hide();
    $('#spnMessage').html('');
    $('.linkGroups').hide();

    $('#btnGetGUID, #btnGetAccessToken, #btnGetBitlinksbyGroup, #btnClicksClear, #btnExpandClear, #btnShorternClear, #lnkClear').click(function () {
        $('#txtShorternURL').val('');
        $('#txtExpandURL').val('');
        $('#txtClicks').val('');
        $('#txtUserShorternUrl').val('');
        $('#txtCheckIfExist').val('');
        $('#txtClicksShorternUrl').val('');
        $('#divMessage').hide();
        $('.linkGroups').hide();
        $('#maintable').html('');
    });

    $('body').on('click', '.btn-checkbox', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $radio = $(this).find(':input[type=radio]');
        if ($radio.length) {
            var $group = $radio.closest('.btn-group');
            $group.find(':input[type=radio]').not($radio).each(function () {
                unchecked($(this));
            });
            var $icon = $(this).find('[data-icon-on]');
            if ($radio.is(':checked')) {
                unchecked($radio);
            } else {
                checked($radio);
                DivShowHide($(this).find('input[type=radio]').val());
            }
            return;
        }
    });
       
    $('#btnGetAccessToken').click(function () {
        var username = "98273fb00d2d50c6e17f8a48fab6eebe2d389e38";
        var password = "e48efc3e6daa5176f8f21e6bc5d93d1afbda1fc7";

        var body = {
            grant_type: 'password',
            username: 'uttar12',
            password: 'hemanth3$'
        };

        var path = urlLoc + 'oauth/access_token';

        $.ajax({
            type: 'POST',
            url: path,
            data: body,
            dataType: 'json',
            crossDomain: true,
            headers: {
                "Authorization": "Basic " + btoa(username + ":" + password),
                "Access-Control-Allow-Origin": "*"
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Host", "api-ssl.bitly.com");
                xhr.setRequestHeader("Content-Type", "application/json");
            },
            cache: false,
            processData: false,
            success: function (data) {
                var results = data;
                console.log(results);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });

    $('#lnkClear').click(function () {
        $('#spnMessage').html('');
        $('.linkGroups').hide();
        $('#maintable').html('');
        $('#txtShorternURL').val('');
        $('#txtExpandURL').val('');
        $('#txtClicks').val('');
        $('#txtUserShorternUrl').val('');
        $('#txtCheckIfExist').val('');
        $('#txtClicksShorternUrl').val('');
        $('#divMessage').hide();
		
		$('.divActions').each(function (i, obj) {
            $(this).addClass('cssHidden');
		});
        return false;
    });
	
	$('#lnkClearGuid').click(function () {
		localStorage.removeItem("bitlyGUID");

		$('#divMessage').removeClass('error');
		$('#divMessage').addClass('success');
		$('#spnMessage').html('Unique GroupId cleared from cookies!!1');
		$('#divMessage').show();
		return false;
    });
	
    $('#btnGetGUID').click(function () {
        localStorage.removeItem("bitlyGUID");
        var path = urlLoc + 'v4/groups';

        $.ajax({
            type: 'GET',
            url: path,
            dataType: "json",
            cache: false,
            beforeSend: function (xhr) {
                //xhr.setRequestHeader("Host", "api-ssl.bitly.com");
                xhr.setRequestHeader("Authorization", "b4dcbeb4d16bfe60b41930d0bf3e5abda1ce8fdd");
                xhr.setRequestHeader("Accept", "application/json");
            },
            processData: false,
            success: function (data) {
                console.log(data);
                if (data != null) {
                    if (data.groups.length > 0) {
                        localStorage.setItem("bitlyGUID", data.groups[0].guid); //To Add
                        //var value = localStorage.getItem("bitlyGUID"); //To get value
                        //localStorage.removeItem("bitlyGUID"); //To Remove
                        $('#divMessage').removeClass('error');
                        $('#divMessage').addClass('success');
                        $('#spnMessage').html('<b>Unique GroupId:</b>&nbsp&nbsp' + localStorage.getItem("bitlyGUID"));
                        $('#divMessage').show();
                    }
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('#btnShorternSubmit').click(function () {
        var isValid = Validation('txtShorternURL');
        //Generate Tiny / ShortURL
        if (isValid) {
            var guidVal = localStorage.getItem("bitlyGUID");
            if (guidVal == null || (typeof guidVal == 'undefined')) {
                $('#divMessage').show();
                $('#divMessage').removeClass('success');
                $('#divMessage').addClass('error');
                $('#spnMessage').html('Please generate GroupId first!');
                return false;
            }

            var path = urlLoc + 'v4/shorten';
            var inputData = {
                "long_url": $('#txtShorternURL').val().trim(),
                "group_guid": localStorage.getItem("bitlyGUID")
            }
            AjaxPost_ShortURL(path, inputData);
        }
    });

    $('#btnExpandSubmit').click(function () {
        var isValid = Validation('txtExpandURL');
        //RevertToLongURL
        if (isValid) {
            var path = urlLoc + 'v4/bitlinks/bit.ly/' + $('#txtExpandURL').val().trim().substring($('#txtExpandURL').val().lastIndexOf('/') + 1);
            AjaxGet_LongURL(path, '');
        }
    });

    $('#btnClicks').click(function () {
        var isValid = Validation('txtClicksShorternUrl');
        //RevertToLongURL
        if (isValid) {
            var path = urlLoc + 'v4/bitlinks/bit.ly/' + $('#txtClicksShorternUrl').val().trim().substring($('#txtClicksShorternUrl').val().lastIndexOf('/') + 1) + '/clicks/summary';
            AjaxGet_LongURL(path, 'ClicksCount');
        }
    });

    $('#btnGetBitlinksbyGroup').click(function () {
        $('.linkGroups').hide();
        var guidVal = localStorage.getItem("bitlyGUID");
        if (guidVal == null || (typeof guidVal == 'undefined')) {
            $('#divMessage').show();
            $('#divMessage').removeClass('success');
            $('#divMessage').addClass('error');
            $('#spnMessage').html('Please generate GroupId first!');
            return false;
        }

        var path = urlLoc + 'v4/groups/' + localStorage.getItem("bitlyGUID") + '/bitlinks';
        AjaxGet_GroupLinks(path);
    });
});


function AjaxPost_ShortURL(URLSource, inputData) {
    $.ajax({
        type: 'POST',
        url: URLSource,
        data: JSON.stringify(inputData),
        dataType: "json",
        cache: false,
        beforeSend: function (xhr) {
            //xhr.setRequestHeader("Host", "api-ssl.bitly.com");
            xhr.setRequestHeader("Authorization", "Bearer d0981ce38928a120aee752b0097fbd5a385e8aa8");
            xhr.setRequestHeader("Content-Type", "application/json");
        },
        processData: false,
        success: function (data) {
            var results = data;
            console.log(results);

            if (results != null) {
                $('#divMessage').removeClass('error');
                $('#divMessage').addClass('success');

                $('#spnMessage').html('<b style="font-weight: bold;color: darkorange;">Short URL:</b>&nbsp&nbsp <a href="' + results.link + '" target="_blank" style="color: whitesmoke;">' + results.link + '</a>');
                $('#divMessage').show();
            } else {
                $('#divMessage').removeClass('success');
                $('#divMessage').addClass('error');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#divMessage').show();
            $('#divMessage').removeClass('success');
            $('#divMessage').addClass('error');

            if (jqXHR.responseJSON != null && (typeof jqXHR.responseJSON !== 'undefined')) {
                $('#spnMessage').html('<b style="font-weight: bold;color: darkorange;">Error:</b>&nbsp&nbsp ' + jqXHR.responseJSON.message + '\n' + jqXHR.responseJSON.description);
            }
            else if (jqXHR.statusText != null) {
                $('#spnMessage').html('<b style="font-weight: bold;color: darkorange;">Error:</b>&nbsp&nbsp ' + jqXHR.statusText);
            }
            console.log(jqXHR);
        }
    });
}

function AjaxGet_LongURL(URLSource, source) {
    $.ajax({
        type: 'GET',
        url: URLSource,
        dataType: "json",
        cache: false,
        beforeSend: function (xhr) {
            //xhr.setRequestHeader("Host", "api-ssl.bitly.com");
            xhr.setRequestHeader("Authorization", "Bearer d0981ce38928a120aee752b0097fbd5a385e8aa8");
            xhr.setRequestHeader("Content-Type", "application/json");
        },
        processData: false,
        success: function (data) {
            var results = data;
            if (results != null) {
                $('#divMessage').removeClass('error');
                $('#divMessage').addClass('success');
                $('#divMessage').show();

                if (source == 'ClicksCount') {
                    $('#spnMessage').html('<b style="font-weight: bold;color: darkorange;">Total No of Clicks:&nbsp&nbsp<br/>' + results.total_clicks);
                }
                else {
                    $('#spnMessage').html('<b style="font-weight: bold;color: darkorange;">Long URL:</b>&nbsp&nbsp<br/> <a href="' + results.long_url + '" target="_blank" style="color: whitesmoke;">' + results.long_url + '</a>');
                }
            }
            else {
                $('#divMessage').removeClass('success');
                $('#divMessage').addClass('error');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#divMessage').show();
            $('#divMessage').removeClass('success');
            $('#divMessage').addClass('error');
            if (jqXHR.responseJSON != null && (typeof jqXHR.responseJSON !== 'undefined')) {
                $('#spnMessage').html('<b style="font-weight: bold;color: darkorange;">Error:</b>&nbsp&nbsp ' + jqXHR.responseJSON.message + '\n' + jqXHR.responseJSON.description);
            }
            else if (jqXHR.statusText != null) {
                $('#spnMessage').html('<b style="font-weight: bold;color: darkorange;">Error:</b>&nbsp&nbsp ' + jqXHR.statusText);
            }
            console.log(jqXHR);
        }
    });
}

function AjaxGet_GroupLinks(URLSource) {    
    $.ajax({
        type: 'GET',
        url: URLSource,
        dataType: "json",
        cache: false,
        beforeSend: function (xhr) {
            //xhr.setRequestHeader("Host", "api-ssl.bitly.com");
            xhr.setRequestHeader("Authorization", "Bearer d0981ce38928a120aee752b0097fbd5a385e8aa8");
            xhr.setRequestHeader("Content-Type", "application/json");
        },
        processData: false,
        success: function (data) {
            
            var results = data;
            if (results != null) {
                console.log(results);
                $.each(results.links, function (index, val) {
                    $('#maintable').append('<tr> <td width="17%">' + val.id + '</td>  <td width="17%">' + val.link + '</td> <td width="15%">' + val.created_at + '</td> <td width="30%">' + val.long_url + '</td></tr>');
                });
                $('.linkGroups').show();
            }
            else {
                $('#divMessage').removeClass('success');
                $('#divMessage').addClass('error');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#divMessage').show();
            $('#divMessage').removeClass('success');
            $('#divMessage').addClass('error');
            if (jqXHR.responseJSON != null && (typeof jqXHR.responseJSON !== 'undefined')) {
                $('#spnMessage').html('<b>Error:</b>&nbsp&nbsp ' + jqXHR.responseJSON.message + '\n' + jqXHR.responseJSON.description);
            }
            else if (jqXHR.statusText != null) {
                $('#spnMessage').html('<b>Error:</b>&nbsp&nbsp ' + jqXHR.statusText);
            }
            console.log(jqXHR);
        }
    });
}


function Validation(ctrlId) {
    var isValid = true;
    if ($('#' + ctrlId).val() == null || $('#' + ctrlId).val().length == 0) {
        $('#divMessage').show();
        $('#divMessage').removeClass('success');
        $('#divMessage').addClass('error');
        $('#spnMessage').html('Please enter a valid URL!');
        isValid = false;
    } else {
        var isValidUrl = isUrlValid($('#' + ctrlId).val().trim());
        if (!isValidUrl) {
            $('#divMessage').show();
            $('#divMessage').removeClass('success');
            $('#divMessage').addClass('error');
            $('#spnMessage').html('Invalid URL!');
            isValid = false;
        }
    }
    return isValid;
}

function isUrlValid(userInput) {
    var regexp = /(https?|ftp):\/\/[^\s\/$.?#].[^\s]*/i;
    console.log('Test: ' + regexp.test(userInput));
    if (regexp.test(userInput))
        return true;
    else
        return false;
}

function checked($input) {
    var $button = $input.closest('.btn');
    var $icon = $button.find('[data-icon-on]');
    $button.addClass('active');
    $input.prop('checked', true);
    $icon.css('width', $icon.width());
    $icon.removeAttr('class').addClass($icon.data('icon-on'));
    $input.trigger('change');
}

function unchecked($input) {
    var $button = $input.closest('.btn');
    var $icon = $button.find('[data-icon-on]');
    $button.removeClass('active');
    $input.prop('checked', false);
    $icon.css('width', $icon.width());
    $icon.removeAttr('class').addClass($icon.data('icon-off'));
    $input.trigger('change');
}

function DivShowHide(divName) {
    $('.divActions').each(function (i, obj) {
        if ($(this).attr('id') === divName) {
            $(this).removeClass('cssHidden');
        }
        else {
            if (!$(this).hasClass('cssHidden'))
                $(this).addClass('cssHidden');
        }
    });
}