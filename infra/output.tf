output "api_endpoint" {
  value       = "${aws_api_gateway_stage.prod.invoke_url}/api/v1/meetings/optimize"
  description = "The public endpoint for the API"
}
