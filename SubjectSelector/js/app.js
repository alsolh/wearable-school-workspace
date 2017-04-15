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

/*global pageIndicator*/

(function() {
    /**
     * currentAppId - The Application ID of Recent Apps;
     * sectionContainer - Contains sections in main page
     */
    var currentAppId = tizen.application.getCurrentApplication().appInfo.id,
        sectionContainer = document.getElementById("section-container");

    /**
     * Deletes section
     * @private
     * @param {Object} section
     */
    function deleteSection(section) {
        var contextId = section.getAttribute("contextId");

        tizen.application.kill(contextId);
        sectionContainer.removeChild(section);
        if (sectionContainer.children.length === 0) {
            tizen.application.getCurrentApplication().exit();
        } else {
            pageIndicator.update();
        }
    }

    /**
     * Creates section that contain application's information
     * @private
     * @param {Object} context - Context of launched application
     * @returns {Object} section
     */
    function createSection(context) {
        var contextId = context.id,
            appInfo = tizen.application.getAppInfo(context.appId),
            appName = appInfo.name,
            iconPath = appInfo.iconPath,
            section;

        section = document.createElement("section");
        // Saves ApplicationContext ID and Application ID for launch, close each application
        section.setAttribute("contextId", contextId);
        section.setAttribute("appId", appInfo.id);
        // Gets content from template
        section.innerHTML = document.getElementById("section-template").innerHTML;
        section.querySelector(".section-appname").innerHTML = appName;
        section.querySelector(".section-delbtn").addEventListener("click", function(e) {
            deleteSection(section);
            e.stopPropagation();
        });
        section.querySelector(".section-icon").style.backgroundImage = "url(" + iconPath + ")";

        return section;
    }

    /**
     * If there is one running application at least, creates sections.
     * Changes page according to the launched application existence.
     * @private
     * @param {Object[]} contexts - Context array of launched applications
     */
    function createSections(contexts) {
        var appInfo,
            section;

        sectionContainer.innerHTML = "";
        for (var i = 0; i < contexts.length; i++) {
            appInfo = tizen.application.getAppInfo(contexts[i].appId);
            /* ApplicationInformation.show property indicates whether the application should be shown.
               For displaying without Recent Apps, check Application ID. */
            if (appInfo.show === true && appInfo.id !== currentAppId) {
                section = createSection(contexts[i]);
                sectionContainer.appendChild(section);
            }
        }
        if (sectionContainer.children.length === 0) {
            setNoRecentAppsPage();
        } else {
            setMainPage();
            pageIndicator.update();
        }
    }

    /**
     * Shows main page
     * @private
     */
    function setMainPage() {
        document.getElementById("main").style.display = "block";
        document.getElementById("no-recent-apps").style.display = "none";
    }

    /**
     * Shows no recent apps page
     * @private
     */
    function setNoRecentAppsPage() {
        document.getElementById("main").style.display = "none";
        document.getElementById("no-recent-apps").style.display = "block";
    }

    /**
     * Closes all launched applications
     * @private
     */
    function closeAll() {
        var length = sectionContainer.children.length;

        for (var i = 0; i < length; i++) {
            deleteSection(sectionContainer.firstChild);
        }
        tizen.application.getCurrentApplication().exit();
    }

    /**
     * Binds events
     */
    function bindEvents() {
        window.addEventListener('tizenhwkey', function(ev) {
            if (ev.keyName === "back") {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {}
            }
            if (ev.keyName === "power") {
                try {
                    tizen.application.getCurrentApplication().hide();
                } catch (ignore) {}
            }
        });
        document.addEventListener("visibilitychange", function() {
            if (!document.hidden) {
                tizen.application.getAppsContext(createSections);
            }
        });
        document.getElementById("main-footer-button").addEventListener("click", function() {
            closeAll();
        });
    }

    /**
     * Initiates function
     */
    function init() {
        bindEvents();
        tizen.application.getAppsContext(createSections);
    }

    // Call the initiation function when the application is loaded
    window.onload = init;
}());