variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  default     = "focusboard"
}

variable "db_password" {
  description = "RDS master password — pass via TF_VAR_db_password env var, never hardcode"
  type        = string
  sensitive   = true
}

variable "docker_image" {
  description = "Docker Hub image to deploy"
  type        = string
  default     = "snaripp/focusboard:latest"
}