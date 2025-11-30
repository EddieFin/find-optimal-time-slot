variable "aws_region" {
  type        = string
  description = "AWS region to deploy into"
  default     = "eu-north-1"
}

variable "allowed_source_ip_cidr" {
  type        = string
  description = "IP CIDR block allowed to access the API. Default is open for all."
  default     = "0.0.0.0/0"
}
