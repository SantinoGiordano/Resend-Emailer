// app/api/send/route.ts
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData(); // To get the form data (including file)

    // Extract fields from the form data
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const body = formData.get('body');
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded or invalid file format' }),
        { status: 400 }
      );
    }

    // Prepare file for attachment (e.g., base64 encoding or saving the file)
    const buffer = Buffer.from(await file.arrayBuffer());
    const attachment = buffer.toString('base64');

    // Send email with Resend API
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: subject as string,
      html: `
        <div>
          <h1>Hello, ${name}</h1>
          <p>${body}</p>
        </div>
      `,
      attachments: [
        {
          content: attachment,
          filename: file.name, // Use the file name from the uploaded file
        },
      ],
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message || 'Unknown error' }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Something went wrong' }),
      { status: 500 }
    );
  }
}
