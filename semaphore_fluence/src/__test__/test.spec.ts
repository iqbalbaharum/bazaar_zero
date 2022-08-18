import { SemaphoreService } from '../service/semaphore_service'

describe("Semaphore service", function () {
  it("success", async () => {
    const message = 'message'
    const svc = new SemaphoreService()
    const res = await svc.add_member(message)
    console.log(JSON.stringify(res))
    expect(res)

    const isMember = svc.is_member(message)
    expect(isMember).toEqual(true)
  })
})