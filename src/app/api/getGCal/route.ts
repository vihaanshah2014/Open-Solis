import { useAuth } from '@clerk/nextjs';
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

async function getGoogleToken(userId: string): Promise<string> {
  try {
    const tokens = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_google');
    const token = tokens.find(t => t.provider === 'oauth_google')?.token;
    if (!token) throw new Error('No Google OAuth token found');
    return token;
  } catch (error) {
    console.error('[GET GOOGLE TOKEN ERROR]', error);
    throw new Error('Failed to retrieve Google OAuth token');
  }
}

function getGoogleCalendar(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  
  return google.calendar({ version: 'v3', auth });
}

export async function GET(req: Request) {
  try {
    const { userId } = useAuth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const accessToken = await getGoogleToken(userId);
    const calendar = getGoogleCalendar(accessToken);

    const response = await calendar.calendarList.list();
    const calendars = response.data.items || [];
    return NextResponse.json(calendars);
  } catch (error) {
    console.error('[GOOGLE CALENDAR GET ERROR]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = useAuth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const accessToken = await getGoogleToken(userId);
    const calendar = getGoogleCalendar(accessToken);

    const { action, ...data } = await req.json();

    switch (action) {
      case 'createCalendar':
        return await createCalendar(calendar, data);
      case 'createEvent':
        return await createEvent(calendar, data);
      case 'updateEvent':
        return await updateEvent(calendar, data);
      case 'deleteEvent':
        return await deleteEvent(calendar, data);
      default:
        return new NextResponse('Bad Request: Invalid action', { status: 400 });
    }
  } catch (error) {
    console.error('[GOOGLE CALENDAR POST ERROR]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

async function createCalendar(calendar: any, data: any) {
  if (!data.summary) {
    return new NextResponse('Bad Request: Missing calendar name', { status: 400 });
  }

  const res = await calendar.calendars.insert({
    requestBody: {
      summary: data.summary,
      timeZone: data.timeZone || 'UTC',
    },
  });

  return NextResponse.json(res.data);
}

async function createEvent(calendar: any, data: any) {
  if (!data.calendarId || !data.summary || !data.start || !data.end) {
    return new NextResponse('Bad Request: Missing event details', { status: 400 });
  }

  const res = await calendar.events.insert({
    calendarId: data.calendarId,
    requestBody: {
      summary: data.summary,
      start: { dateTime: data.start },
      end: { dateTime: data.end },
    },
  });

  return NextResponse.json(res.data);
}

async function updateEvent(calendar: any, data: any) {
  if (!data.calendarId || !data.eventId || !data.summary || !data.start || !data.end) {
    return new NextResponse('Bad Request: Missing event details', { status: 400 });
  }

  const res = await calendar.events.update({
    calendarId: data.calendarId,
    eventId: data.eventId,
    requestBody: {
      summary: data.summary,
      start: { dateTime: data.start },
      end: { dateTime: data.end },
    },
  });

  return NextResponse.json(res.data);
}

async function deleteEvent(calendar: any, data: any) {
  if (!data.calendarId || !data.eventId) {
    return new NextResponse('Bad Request: Missing event ID', { status: 400 });
  }

  await calendar.events.delete({
    calendarId: data.calendarId,
    eventId: data.eventId,
  });

  return new NextResponse(null, { status: 204 });
}