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

/*global define, console, tizen */

/**
 * Sensor model.
 *
 * @requires {@link core/event}
 * @requires {@link core/window}
 * @namespace models/pressure
 * @memberof models
 */
define({
    name: 'models/pressure',
    requires: [
        'core/event',
        'core/window'
    ],
    def: function modelsPressure(e, window) {
        'use strict';

        /**
         * Name of the sensor type.
         *
         * @private
         * @const {string}
         */
        var SENSOR_TYPE = 'PRESSURE',

            /**
             * Error type name.
             *
             * @private
             * @const {string}
             */
            ERROR_TYPE_NOT_SUPPORTED = 'NotSupportedError',

            /**
             * Maximum size of the previousPressures array.
             *
             * @private
             * @const {number}
             */
            MAX_LENGTH = 7,

            /**
             * Reference to the sensor service.
             *
             * @private
             * @type {SensorService}
             */
            sensorService = null,

            /**
             * Reference to the pressure sensor.
             *
             * @private
             * @type {PressureSensor}
             */
            pressureSensor = null,

            /**
             * Array of registered pressures.
             *
             * @private
             * @type {number[]}
             */
            previousPressures = [],

            /**
             * Average pressure.
             *
             * @private
             * @type {number}
             */
            averagePressure = 0,

            /**
             * Current pressure.
             *
             * @private
             * @type {number}
             */
            currentPressure = 0;

        /**
         * Performs action on start sensor success.
         *
         * @private
         * @fires models.pressure.start
         */
        function onSensorStartSuccess() {
            e.fire('start');
        }

        /**
         * Performs action on start sensor error.
         *
         * @private
         * @param {Error} e
         * @fires models.pressure.error
         */
        function onSensorStartError(e) {
            console.error('Pressure sensor start error: ', e);
            e.fire('error', e);
        }

        /**
         * Updates the average pressure value.
         *
         * @private
         * @param {number} currentPressure
         * @returns {number}
         */
        function updateAveragePressure(currentPressure) {
            previousPressures.push(currentPressure);

            var len = previousPressures.length;

            if (len <= MAX_LENGTH) {
                // nothing to shift yet, recalculate whole average
                averagePressure = previousPressures.reduce(function sum(a, b) {
                    return a + b;
                }) / len;
            } else {
                // add the new item and subtract the one shifted out
                averagePressure += (
                    currentPressure - previousPressures.shift()
                ) / len;
            }
            return averagePressure;
        }

        /**
         * Performs action on sensor change.
         *
         * @private
         * @param {object} data
         */
        function onSensorChange(data) {
            currentPressure = data.pressure;
            updateAveragePressure(currentPressure);
            e.fire('change', {
                current: data.pressure,
                average: averagePressure
            });
        }

        /**
         * Starts pressure sensor.
         *
         * @memberof models/pressure
         * @public
         */
        function start() {
            pressureSensor.start(onSensorStartSuccess, onSensorStartError);
        }

        /**
         * Sets sensor change listener.
         *
         * @memberof models/pressure
         * @public
         */
        function setChangeListener() {
            pressureSensor.setChangeListener(onSensorChange);
        }

        /**
         * Returns sensor value.
         *
         * @memberof models/pressure
         * @public
         * @returns {number}
         */
        function getSensorValue() {
            return currentPressure;
        }

        /**
         * Returns average pressure value.
         *
         * @memberof models/pressure
         * @public
         * @returns {number}
         */
        function getAverageSensorValue() {
            return averagePressure;
        }

        /**
         * Sets current pressure value.
         *
         * @private
         * @param {object} data
         */
        function setCurrentPressureValue(data) {
            currentPressure = data.pressure;
        }

        /**
         * Returns true if pressure sensor is available, false otherwise.
         *
         * @memberof models/pressure
         * @public
         * @returns {boolean}
         */
        function isAvailable() {
            return !!pressureSensor;
        }

        /**
         * Initializes module.
         *
         * @memberof models/pressure
         * @public
         * @fires 'models.pressure.error'
         */
        function init() {
            sensorService = tizen.sensorservice ||
                (window.webapis && window.webapis.sensorservice) ||
                null;

            if (!sensorService) {
                e.fire('error', {type: 'notavailable'});
            } else {
                try {
                    pressureSensor = sensorService
                        .getDefaultSensor(SENSOR_TYPE);
                    pressureSensor
                        .getPressureSensorData(setCurrentPressureValue);
                } catch (error) {
                    if (error.type === ERROR_TYPE_NOT_SUPPORTED) {
                        e.fire('error', {type: 'notsupported'});
                    } else {
                        e.fire('error', {type: 'unknown'});
                    }
                }
            }
        }

        return {
            initSensor: init,
            start: start,
            isAvailable: isAvailable,
            setChangeListener: setChangeListener,
            getAverageSensorValue: getAverageSensorValue,
            getSensorValue: getSensorValue
        };
    }

});
