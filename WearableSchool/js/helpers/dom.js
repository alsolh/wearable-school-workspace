/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd. All rights reserved.
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

/* global define */

/**
 * Dom helper module.
 *
 * @namespace helpers/dom
 * @memberof helpers
 */

define({
    name: 'helpers/dom',
    def: function helpersDom() {
        'use strict';

        /**
         * Returns parent node with class name given as second parameter
         * of the child given as first parameter.
         *
         * @memberof helpers/dom
         * @public
         * @param {DOMElement} element
         * @param {string} parentClassName
         * @returns {DOMElement}
         */
        function findParentByClassName(element, parentClassName) {
            parentClassName = parentClassName.toLowerCase();
            do {
                element = element.parentNode;
                if (element.classList &&
                        element.classList.contains(parentClassName)) {
                    return element;
                }
            } while (element.parentNode);
        }

        return {
            findParentByClassName: findParentByClassName
        };
    }
});
