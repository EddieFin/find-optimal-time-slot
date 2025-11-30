import { APIGatewayProxyHandler } from "aws-lambda";
import { findOptimalSlots } from "./logic";
import { OptimizeRequest } from "./types";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("Event Received:", JSON.stringify(event, null, 2));

    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const request = JSON.parse(event.body) as OptimizeRequest;
    const result = findOptimalSlots(request);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    console.error("Error processing request:", error);

    const isClientError = error.message.includes("Invalid input") || error.message.includes("No matches") || error.message.includes("No time slots");

    return {
      statusCode: isClientError ? 400 : 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
