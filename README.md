# find-optimal-time-slot

## Manually created AWS resources

Some AWS resources needed to be created manually. These commands are listed here **as documentation of what was done**.

### Terraform backend

Create S3 bucket in eu-north-1 region:
```aws s3 mb s3://find-optimal-time-slot-terraform-backend --region eu-north-1```

Enable bucket versioning:
```aws s3api put-bucket-versioning --bucket find-optimal-time-slot-terraform-backend --versioning-configuration Status=Enabled```

### GitHub Actions OIDC

Create Identity Provider:

```aws iam create-open-id-connect-provider --url <https://token.actions.githubusercontent.com> --client-id-list sts.amazonaws.com```

Create role for GitHub Actions to assume:

```bash
aws iam create-role --role-name GitHubActionsWorkflowRole --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::581429708653:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:EddieFin/find-optimal-time-slot:ref:refs/heads/main"
        }
      }
    }
  ]
}'
```

Create a suitable permission policy:

```bash
aws iam create-policy --policy-name GitHubActionsWorkflowPolicy --policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::find-optimal-time-slot-terraform-backend"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::find-optimal-time-slot-terraform-backend/terraform.tfstate"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::find-optimal-time-slot-terraform-backend/terraform.tfstate.tflock"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*",
        "apigateway:*",
        "logs:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:TagRole",
        "iam:PassRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:ListRolePolicies",
        "iam:ListAttachedRolePolicies"
      ],
      "Resource": "arn:aws:iam::581429708653:role/find-optimal-time-lambda-role"
    }
  ]
}'
```

And attach the policy to the role:
```aws iam attach-role-policy --role-name GitHubActionsWorkflowRole --policy-arn arn:aws:iam::581429708653:policy/GitHubActionsWorkflowPolicy```
