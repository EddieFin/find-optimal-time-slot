output "api_endpoint" {
  value = "${aws_api_gateway_stage.prod.invoke_url}/v1/meetings/optimize"
}
