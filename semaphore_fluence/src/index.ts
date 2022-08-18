import { Fluence, KeyPair } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import { registerISemaphoreService } from './_aqua/semaphore'
import { SemaphoreService } from './service/semaphore_service'

const relay = krasnodar[0];
const skBytes = 'WuPn8h/3+kvP49yR/x/d6oCAo5HewOFdzfOdbNjd4w4=';

export async function runServer() {
    await Fluence.start({
        connectTo: relay,
        KeyPair: await KeyPair.fromEd25519SK(Buffer.from(skBytes, 'base64')),
    });

    registerISemaphoreService(new SemaphoreService())

    console.log('application started');
    console.log('peer id is: ', Fluence.getStatus().peerId);
    console.log('relay address: ', relay.multiaddr);
    console.log('relay is: ', Fluence.getStatus().relayPeerId);
    console.log('press any key to quit...');
}

export async function justStop() {
  await Fluence.stop();
}

export async function waitForKeypressAndStop() {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', async () => {
      await Fluence.stop();
      process.exit(0);
  });
}