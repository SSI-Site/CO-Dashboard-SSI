import { authHandlers } from './handlers/authHandlers';
import { speakersHandlers } from './handlers/speakersHandlers';
import { talksHandlers } from './handlers/talksHandlers';
import { giftsHandlers } from './handlers/giftsHandlers';
import { sponsorsHandlers } from './handlers/sponsorsHandlers';
import { studentsHandlers } from './handlers/studentsHandlers';
import { presencesHandlers } from './handlers/presencesHandlers';
import { winnersHandlers } from './handlers/winnersHandlers';
import { tokensHandlers } from './handlers/tokensHandlers';

export const handlers = [
  ...authHandlers,
  ...speakersHandlers,
  ...talksHandlers,
  ...giftsHandlers,
  ...sponsorsHandlers,
  ...studentsHandlers,
  ...presencesHandlers,
  ...winnersHandlers,
  ...tokensHandlers,
];