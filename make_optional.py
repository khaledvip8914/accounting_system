import re

with open('prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('companyId String @default("default")', 'companyId String? @default("default")')
content = content.replace('company Company @relation(fields: [companyId], references: [id])', 'company Company? @relation(fields: [companyId], references: [id])')

with open('prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)

print("Made company relations optional for safety.")
