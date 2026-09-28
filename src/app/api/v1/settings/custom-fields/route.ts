import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || 'default';
    const module = searchParams.get('module');

    const where: any = { companyId };
    if (module) {
      where.module = module;
    }

    const fields = await prisma.customField.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(fields);
  } catch (error: any) {
    console.error('Error fetching custom fields:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure uniqueness manually or let Prisma throw
    const existing = await prisma.customField.findUnique({
      where: {
        companyId_module_name: {
          companyId: data.companyId || 'default',
          module: data.module,
          name: data.name,
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Field with this name already exists for this module.' }, { status: 400 });
    }

    const newField = await prisma.customField.create({
      data: {
        companyId: data.companyId || 'default',
        module: data.module,
        name: data.name,
        label: data.label,
        labelAr: data.labelAr,
        type: data.type,
        options: data.options || null,
        isRequired: data.isRequired || false,
        showInPrint: data.showInPrint || false,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(newField, { status: 201 });
  } catch (error: any) {
    console.error('Error creating custom field:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
