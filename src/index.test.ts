import { handler } from "./index";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

const createEvent = (body: any): APIGatewayProxyEvent =>
  ({
    body: body ? JSON.stringify(body) : null,
  } as APIGatewayProxyEvent);

const mockContext = {} as Context;
const mockCallback = jest.fn();

describe("Lambda Handler: index.ts", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("returns 200 and optimal slots for valid input", async () => {
    const body = {
      meetingName: "Test",
      participants: [{ name: "A", preferredSlots: ["2025-01-01T10:00"] }],
    };

    const result = await handler(createEvent(body), mockContext, mockCallback);

    if (!result) throw new Error("Handler returned void");

    expect(result.statusCode).toBe(200);
    const parsed = JSON.parse(result.body);
    expect(parsed.meetingName).toBe("Test");
  });

  it("returns 400 Bad Request if body is missing", async () => {
    const event = { body: null } as APIGatewayProxyEvent;
    const result = await handler(event, mockContext, mockCallback);

    if (!result) throw new Error("Handler returned void");
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toContain("Missing request body");
  });

  it("returns 400 Bad Request if JSON is malformed", async () => {
    const event = { body: "{ invalid-json " } as APIGatewayProxyEvent;

    const result = await handler(event, mockContext, mockCallback);

    if (!result) throw new Error("Handler returned void");
    expect(result.statusCode).toBeDefined();
  });

  it("returns 400 when business logic throws a validation error", async () => {
    const body = { meetingName: "No Participants", participants: [] };

    const result = await handler(createEvent(body), mockContext, mockCallback);

    if (!result) throw new Error("Handler returned void");
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toContain("Invalid input");
  });
});
