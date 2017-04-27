/*
 * Copyright (c) 2016 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
    /**
     * Sets default event listeners
     * @private
     */
    function setDefaultEvents() {
        // Add eventListener for tizenhwkey
        document.addEventListener("tizenhwkey", function(e) {
            if (e.keyName === "back") {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (error) {
                    console.error("getCurrentApplication(): " + error.message);
                }
            }
        });
    }

    /**
     * Initiates the application
     * @private
     */
    function init() {
        setDefaultEvents();
    }

    window.onload = init;
}());