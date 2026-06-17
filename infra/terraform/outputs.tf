output "ec2_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_eip.app.public_ip
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "app_url" {
  description = "Application URL"
  value       = "http://${aws_eip.app.public_ip}:3000"
}