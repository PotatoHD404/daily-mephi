export const isToxic = jest.fn()

beforeEach(() => {
    isToxic.mockImplementation(async () => true)
})

afterEach(() => {
    isToxic.mockReset()
})

jest.mock('lib/toxicity', () => ({
    __esModule: true,
    isToxic: isToxic,
}))

