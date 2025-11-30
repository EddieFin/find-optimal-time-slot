terraform {
  backend "s3" {
    bucket       = "find-optimal-time-slot-terraform-backend"
    key          = "terraform.tfstate"
    region       = "eu-north-1"
    encrypt      = true
    use_lockfile = true
  }
}
