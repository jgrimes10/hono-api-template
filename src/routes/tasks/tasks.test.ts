/* eslint-disable ts/ban-ts-comment */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import env from '@/env';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/lib/constants';
import createApp from '@/lib/create-app';
import { testClient } from 'hono/testing';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from 'vitest';
import { ZodIssueCode } from 'zod';
import router from './tasks.index';

// Make sure the NODE_ENV is set to 'test'.
if (env.NODE_ENV !== 'test') {
    throw new Error('NODE_ENV must be \'test\'');
}

/** The test client. */
const client = testClient(createApp().route('/', router));

describe('tasks route', () => {
    beforeAll(async () => {
        execSync('pnpm drizzle-kit push');
    });

    afterAll(async () => {
        fs.rmSync('test.db', { force: true });
    });

    it('should valiate the body when creating a task', async () => {
        const response = await client.tasks.$post({
            // @ts-expect-error
            json: {
                done: false,
            },
        });
        expect(response.status).toBe(422);
        if (response.status === 422) {
            const json = await response.json();
            expect(json.error.issues[0].path[0]).toBe('name');
            expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
        }
    });

    /** The ID of the task to test. */
    const id = 1;
    /** The name of the task to test. */
    const name = 'Learn vitest';

    it('should create a task', async () => {
        const response = await client.tasks.$post({
            json: {
                name,
                done: false,
            },
        });
        expect(response.status).toBe(201);
        if (response.status === 201) {
            const json = await response.json();
            expect(json.name).toBe(name);
            expect(json.done).toBe(false);
        }
    });

    it('should get the list of all tasks', async () => {
        const response = await client.tasks.$get();
        expect(response.status).toBe(200);
        if (response.status === 200) {
            const json = await response.json();
            expectTypeOf(json).toBeArray();
            expect(json.length).toBe(1);
        }
    });

    it('should validate the id parameter when getting a task', async () => {
        const response = await client.tasks[':id'].$get({
            param: {
                // @ts-expect-error:w
                id: 'wat',
            },
        });
        expect(response.status).toBe(422);
        if (response.status === 422) {
            const json = await response.json();
            expect(json.error.issues[0].path[0]).toBe('id');
            expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
        }
    });

    it('should return 404 when getting a task that does not exist', async () => {
        const response = await client.tasks[':id'].$get({
            param: {
                id: 999,
            },
        });
        expect(response.status).toBe(404);
        if (response.status === 404) {
            const json = await response.json();
            expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
        }
    });

    it('should get a single task', async () => {
        const response = await client.tasks[':id'].$get({
            param: {
                id,
            },
        });
        expect(response.status).toBe(200);
        if (response.status === 200) {
            const json = await response.json();
            expect(json.name).toBe(name);
            expect(json.done).toBe(false);
        }
    });

    it('should validate the body when updating a task', async () => {
        const response = await client.tasks[':id'].$patch({
            param: {
                id,
            },
            json: {
                name: '',
            },
        });
        expect(response.status).toBe(422);
        if (response.status === 422) {
            const json = await response.json();
            expect(json.error.issues[0].path[0]).toBe('name');
            expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
        }
    });

    it('should validate the id param when updating a task', async () => {
        const response = await client.tasks[':id'].$patch({
            param: {
                // @ts-expect-error
                id: 'wat',
            },
            json: {},
        });
        expect(response.status).toBe(422);
        if (response.status === 422) {
            const json = await response.json();
            expect(json.error.issues[0].path[0]).toBe('id');
            expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
        }
    });

    it('should validate an empty body when updating a task', async () => {
        const response = await client.tasks[':id'].$patch({
            param: {
                id,
            },
            json: {},
        });
        expect(response.status).toBe(422);
        if (response.status === 422) {
            const json = await response.json();
            expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
            expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
        }
    });

    it('should update a single property of a task', async () => {
        const response = await client.tasks[':id'].$patch({
            param: {
                id,
            },
            json: {
                done: true,
            },
        });
        expect(response.status).toBe(200);
        if (response.status === 200) {
            const json = await response.json();
            expect(json.done).toBe(true);
        }
    });

    it('should validate the id when deleting', async () => {
        const response = await client.tasks[':id'].$delete({
            param: {
            // @ts-expect-error
                id: 'wat',
            },
        });
        expect(response.status).toBe(422);
        if (response.status === 422) {
            const json = await response.json();
            expect(json.error.issues[0].path[0]).toBe('id');
            expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
        }
    });

    it('should remove a task', async () => {
        const response = await client.tasks[':id'].$delete({
            param: {
                id,
            },
        });
        expect(response.status).toBe(204);
    });
});
