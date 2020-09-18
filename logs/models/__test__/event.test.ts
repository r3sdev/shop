import {Event} from '../event';

describe('event', () => {
    it('should replace _id -> id', async () => {
        const event = Event.build({
            event: "test-event",
            eventData: {
                data: "test-data"
            },
            userId: "test-userId"
        })

        await event.save();

        const regExp = /\w{24}/

        expect(event.id).toEqual(expect.stringMatching(regExp));
        expect(event.toJSON()._id).toBeUndefined()
    })
})