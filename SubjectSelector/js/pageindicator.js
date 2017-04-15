/*
 *      Copyright (c) 2016 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*global tau */
/*exported pageIndicator*/

var pageIndicator = (function() {
    /**
     * pageIndicator - Module for page indicator and section changer setting
     * main - Element wrap all elements inside of main tag
     * changer - Element in main page for activate section changer
     * container - Element in main page for contain sections
     * sections - Section array in this application
     * sectionChanger - Tau section changer object
     * elPageIndicator - Element in main page for display indicator
     * indicator - Tau page indicator object
     * indicatorHandler - Changes indicator when section change
     */
    var pageIndicator = {},
        main = document.getElementById("main"),
        changer = document.getElementById("main-section-changer"),
        container = document.getElementById("section-container"),
        sections = null,
        sectionChanger = null,
        elPageIndicator = document.getElementById("main-page-indicator"),
        indicator = null,
        indicatorHandler = null;

    /**
     * Destroys section changer and page indicator
     * @public
     */
    pageIndicator.destroy = function() {
        if (sectionChanger !== null) {
            sectionChanger.destroy();
            indicator.destroy();
        }
    };

    /**
     * Updates sections and page indicator state
     * @public
     */
    pageIndicator.update = function() {
        sections = document.querySelectorAll("section");

        if (indicator !== null) {
            indicator.destroy();
        }

        // Sets number of sections without template
        if (sections.length > 1) {
            indicator = tau.widget.PageIndicator(elPageIndicator, {
                numberOfPages: sections.length - 1
            });

            if (sectionChanger === null) {
                sectionChanger = new tau.widget.SectionChanger(changer, {
                    circular: false,
                    orientation: "horizontal",
                    useBouncingEffect: true
                });
            }
            sectionChanger.refresh();
            indicator.setActive(sectionChanger.getActiveSectionIndex());
        }
    };

    /**
     * Handles rotary event.
     * @private
     * @param {Object} event
     */
    function rotaryEventHandler(event) {
        var direction = event.detail.direction,
            length = container.children.length,
            sectionIndex;

        if (length > 0) {
            sectionIndex = sectionChanger.getActiveSectionIndex();

            if (direction === "CW") {
                if (sectionIndex < (length - 1)) {
                    sectionIndex = sectionIndex + 1;
                }
            } else if (direction === "CCW") {
                if (sectionIndex > 0) {
                    sectionIndex = sectionIndex - 1;
                }
            }
            //Changes selected section during 100 milliseconds.
            sectionChanger.setActiveSection(sectionIndex, 100);
        }
    }

    /**
     * Handles swipe event.
     * @private
     * @param {Object} event
     */
    function swipeEventHandler(event) {
        var direction = event.detail.direction,
            index = sectionChanger.getActiveSectionIndex(),
            eventTarget = container.children[index],
            contextId = eventTarget.getAttribute("contextId");

        if (direction === "down") {
            tizen.application.kill(contextId);
            container.removeChild(eventTarget);
            if (container.children.length === 0) {
                tizen.application.getCurrentApplication().exit();
            } else {
                pageIndicator.update();
            }
        }
    }

    /**
     * Initiates function
     * @public
     */
    pageIndicator.init = function() {
        main.addEventListener("pagebeforeshow", function() {
            tau.event.enableGesture(changer, new tau.event.gesture.Swipe({
                orientation: "vertical"
            }));
        });

        main.addEventListener("pageshow", function() {
            pageIndicator.update();
        });

        main.addEventListener("pagehide", function() {
            pageIndicator.destroy();
        });

        indicatorHandler = function(e) {
            indicator.setActive(e.detail.active);
        };
        changer.addEventListener("sectionchange", indicatorHandler, false);

        // Closes application of this page when occur swipe down event
        changer.addEventListener("swipe", swipeEventHandler);

        // Launches application of this page when occur click event
        changer.addEventListener("click", function() {
            var index = sectionChanger.getActiveSectionIndex(),
                eventTarget = container.children[index],
                appId = eventTarget.getAttribute("appId");

            tizen.application.launch(appId);
        });

        //Rotary event handler
        document.addEventListener("rotarydetent", rotaryEventHandler);
    };

    pageIndicator.init();

    return pageIndicator;
}());