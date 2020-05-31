import { isNetworkConnected } from '../src/struct/index'

test('makes sure that we can tell that our unit tests run somewhere with Internet connection', async () => {
  expect(await isNetworkConnected()).toBe(true)
})

export {}
