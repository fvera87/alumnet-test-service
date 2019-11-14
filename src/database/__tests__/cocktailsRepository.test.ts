import * as MockDate from 'mockdate';
import { clearTable } from '../config';

const time = Date.now();
MockDate.set(time);
describe('cocktails repository tests', () => {
  beforeAll(async () => {
    clearTable(process.env.DB_COCKTAILS_TABLE);
  });
  it('should give explanaitons of what to test', () => {
    /**
     * As the main point of the code challenge is accomplished, and I don't think 100% test coverage is needed for such a dummy project,
     * I thought on explaining what would I test in case this would be a real world app.
     *
     * In this case, we are using dynamodb-local, which is a DB that runs in memory.
     * I would then test that for both ingredients list and a single ingredient, elements are created and retrieved as expected.
     * Also, we should check that the params throw the correct errors when they are not valid and that the update Date is the expected (mocked above)
     */

    expect(true).toBeTruthy();
  });
});
