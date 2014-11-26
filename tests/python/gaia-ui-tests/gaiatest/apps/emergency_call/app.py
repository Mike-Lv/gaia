# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from marionette import expected
from marionette import Wait
from marionette.by import By

from gaiatest.apps.base import Base


class EmergencyCall(Base):

    _emergency_frame_locator = (By.CSS_SELECTOR, ".secureAppWindow.active[data-manifest-name='EmergencyCall'] iframe")
    _emergency_dialer_keypad_locator = (By.ID, 'keypad')

    def switch_to_emergency_call_frame(self):
        frame = Wait(self.marionette).until(
            expected.element_present(*self._emergency_frame_locator))
        Wait(self.marionette).until(expected.element_displayed(frame))
        self.marionette.switch_to_frame(frame)

    @property
    def is_emergency_dialer_keypad_displayed(self):
        return self.marionette.find_element(
            *self._emergency_dialer_keypad_locator).is_displayed()