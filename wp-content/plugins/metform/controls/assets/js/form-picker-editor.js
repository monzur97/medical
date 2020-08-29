( function (jQuery, elementor, oElementor) {
    "use strict";
    if (typeof window.parent != 'undefined') {
        // window.parent found
    }else{
        // window.parent missing
        return;
    }

    let windowParent = window.parent;
    var ElementsKit_WidgetArea = {
        init: function () {
            elementor.hooks.addAction('frontend/element_ready/metform.default', function (scope) {
                 /*
                * Checks if in the editor, if not stop the rest from executing
                */
                if ( !elementor.isEditMode() ) {
                    return;
                }

                var formTemplateSelectorOpenButton = scope.find('.formpicker_warper_edit');

                formTemplateSelectorOpenButton.off('click.metform').on('click.metform', function(){
                    var formTemplateSelector = windowParent.jQuery('#metform-open-content-editor'),
                    key = formTemplateSelectorOpenButton.attr('data-metform-formpicker-key');
                    var nonce = jQuery(this).attr('data-nonce');
                    formTemplateSelector.find('.metform-error').remove();
                    


                    var popupTab = formTemplateSelector.find('.metform-content-editor-radio');
                    popupTab.on('click', function(e){
                        var self = jQuery(this),
                            dataTarget = self.closest('li').data('target');
                            
                            formTemplateSelector.find('#'+ dataTarget).fadeIn().siblings().hide();
                    });
                    
                    
                    jQuery.ajax({
                        url: jQuery(this).attr('resturl') + (key || 0),
                        type: 'get',
                        headers: {
                            'X-WP-Nonce': nonce
                        },
                        dataType: 'html',
                        success: function (output) {
                            if(output){
                                
                                formTemplateSelector.find('.metform-content-editor-radio').first().trigger('click');
                                formTemplateSelector.find('.metform-open-content-editor-templates').html(output);
                            } else {
                                formTemplateSelector.find('.metform-content-editor-radio').last().trigger('click');
                                formTemplateSelector.find('.metform-open-content-editor-templates').parent().append("<p class='metform-error'>No forms were created yet!</p>")
                            }
                            
                        }
                    });

                    formTemplateSelector.show();
                });
        
                windowParent.jQuery('#metform-open-content-editor').off('click.metform').on('click.metform', '.metform-open-content-editor-button', function() {
                    
                    var iframeModal = windowParent.jQuery('.metform-dynamic-content-modal'),
                        iframe = iframeModal.find('#formpicker-control-iframe'),
                        iframeLoading = iframeModal.find('.dialog-lightbox-loading'),
                        modalContainer = iframeModal.find('.dialog-type-lightbox');


                    var conParent = jQuery(this).parents('.metform-open-content-inner'),
                        content_key = conParent.find('.metform-open-content-editor-templates').val(),
                        editorTabInput = conParent.find('.metform-content-editor-radio:checked').val(),
                        editorTamplateInput = conParent.find('.metform-template-radio:checked').val(),
                        editorTemplateName = conParent.find('.metform-template-input-con input').val();
                    var nonce = windowParent.jQuery('#metform-form-modalinput-settings').data('nonce');
                    
                        if(editorTabInput == 'saved'){
                            windowParent.jQuery('body').attr('data-metform-template-key', content_key);
                        }else{
                            jQuery.ajax({
                                url: jQuery(this).attr('resturl') + 'builder_form_id/' + editorTamplateInput +'?title=' + editorTemplateName,
                                type: 'GET',
                                headers: {
                                    'X-WP-Nonce': nonce
                                },
                                success: function (output) {
                                    windowParent.jQuery('body').attr('data-metform-template-key', output);
                                    conParent.find('.metform-template-input-con input').val('');
                                    conParent.find('.metform-template-radio').removeAttr('checked').first().attr('checked', 'checked');
                                    content_key = output;
                                },
                                async: false
                            });
                        }
                    
                    var url = jQuery(this).attr('resturl') + 'builder/' + content_key;

                    windowParent.jQuery('body').attr('data-metform-template-load', 'false');

                    modalContainer.show();
                    iframeModal.show();
                    iframeLoading.show();
                    iframe.contents().find('#elementor-loading').show();
                    iframe.css('z-index', '-1');
                    iframe.attr('src', url);

                    iframe.on('load', function() {
                        iframeLoading.hide();
                        iframe.show();
                        iframe.contents().find('#elementor-loading').hide();
                        iframe.css('z-index', '1');
                    });
                });

                windowParent.jQuery('#elementor-editor-wrapper').on('click', '#metform-inspactor-edit-button', function(){
                    console.log('dom found');
                    // trigger click.metform', '.metform-open-content-editor-button'
                });
                
                
                function metformClosingPopup(windowLoc){
                    windowLoc.jQuery('body').attr('data-metform-template-load', 'true');
                    windowLoc.jQuery('.metform-dynamic-content-modal').hide();
                    windowLoc.jQuery('#metform-open-content-editor').hide();
                }

                if(typeof windowParent.jQuery !== 'undefined'){
                    var iframeCloseButton = windowParent.jQuery('.metform-close-editor-modals');
                    iframeCloseButton.off('click.metform').on('click.metform', function() {

                        if(jQuery(this).hasClass('metform-editor-close')) {

                            var iframeModal = windowParent.jQuery('.metform-dynamic-content-modal'),
                                iframe = iframeModal.find('#formpicker-control-iframe'),
                                iframeWindow = (iframe[0].contentWindow || iframe[0].contentDocument),
                                saved = iframeWindow.jQuery('#elementor-panel-saver-button-publish').hasClass('elementor-disabled');

                            if(!saved){

                                if(confirm("Leaving? Changes you made may not be saved.")) {

                                    iframeWindow.jQuery(iframeWindow).off('beforeunload');

                                    metformClosingPopup(windowParent);
                                } else {
                                    iframeWindow.jQuery(iframeWindow).off('beforeunload');
                                }
                                
                            } else {
                                metformClosingPopup(windowParent);
                            }
                        } else if(jQuery(this).hasClass('metform-picker-close')){

                            metformClosingPopup(windowParent);

                            var pickerContainer = windowParent.jQuery('#metform-open-content-editor'),
                                tabValue = pickerContainer.find('.metform-content-editor-radio:checked').val(),
                                templateValue = pickerContainer.find('.metform-open-content-editor-templates').val();

                            
                            if(tabValue == 'saved'){
                                windowParent.jQuery('body').attr('data-metform-template-key', templateValue);
                            }
                            metformClosingPopup(windowParent);
                        }
                        else {
                            metformClosingPopup(windowParent);
                        }

                        windowParent.jQuery('#metform-open-content-editor').find('.metform-picker-close').hide();
                        windowParent.jQuery('#metform-open-content-editor').find('.metform-template-radio').removeAttr('checked').first().attr('checked', 'checked');
                        
                    });
                }

                windowParent.jQuery('#metform-open-content-editor').find('.metform-open-content-editor-templates').on('change', function(){
                    windowParent.jQuery('#metform-open-content-editor').find('.metform-picker-close').fadeIn();
                });

                // update and close
                var updateClose = windowParent.jQuery('.metform-form-update-close-btn');
                updateClose.off('click.metform').on('click.metform', function(){
                    var iframeModal = windowParent.jQuery('.metform-dynamic-content-modal'),
                        iframe = iframeModal.find('#formpicker-control-iframe'),
                        iframeWindow = (iframe[0].contentWindow || iframe[0].contentDocument),
                        needSaving = iframeWindow.jQuery('#elementor-panel-saver-button-publish:not([disabled])').hasClass('elementor-disabled');

                    if(!needSaving){
                        iframeWindow.jQuery('#elementor-panel-saver-button-publish:not([disabled])').trigger('click');
                        var checkExist = setInterval(function() {
                            if(iframeWindow.jQuery('#elementor-panel-saver-button-publish:not([disabled])').hasClass('elementor-disabled')) {
                                windowParent.jQuery('.metform-close-editor-modals').trigger('click.metform');
                                clearInterval(checkExist);
                            }
                         }, 100); // check every 100ms
                    } else {
                        windowParent.jQuery('.metform-close-editor-modals').trigger('click.metform');
                    }
                    
                });
                // end update and close

            });
        },
    };

    jQuery(window).on('elementor/frontend/init', ElementsKit_WidgetArea.init);

}(jQuery, window.elementorFrontend) );
