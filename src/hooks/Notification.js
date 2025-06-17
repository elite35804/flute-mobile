import React from 'react';
import { useOvermind } from '@/store';

/**
 * Notification Subscribe
 */
export default function useSetupNotification() {
  const { actions } = useOvermind();
  const notification = actions.pushNotification;

  // Whenever player id is arrived
  React.useEffect(() => {
    if (notification.playerId) {
      // When valid playerId
      // Call api to update player id
      actions.user.updatePlayerId(notification.playerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification.playerId]);

  // When ever new notification is arrived
  React.useEffect(() => {
    if (notification.notification) {
      // do some notification stuff.
    }
  }, [notification.notification]);

  // Whenever new open result is arrived
  // When ever new notification is arrived
  React.useEffect(() => {
    if (notification.openResult) {
      // do some notification stuff.
      const openResult = notification.openResult;

      console.log('useSetupNotification(): OpenResult', openResult);

      const payload = openResult.notification.payload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const additionalData = payload.additionalData;
      
      if(additionalData) {
        const type = additionalData.type

        if (type === 'message') {

        } else if (type === 'notification') {
          var notificationId = additionalData.id;
          var alert = additionalData.alert
          // TODO query notification, then pass result to alert
          navigation.navigate('Reviews', { alert: alert } )
        }
      }
    }
  }, [notification.openResult]);
}
