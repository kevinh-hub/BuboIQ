import { projectId } from './supabase/info';

export interface DownloadAgentResult {
  success: boolean;
  filename?: string;
  error?: string;
}

export async function downloadAgentInstaller(
  platform: 'windows' | 'macos' | 'linux',
  accessToken: string | undefined
): Promise<DownloadAgentResult> {
  if (!accessToken) return { success: false, error: 'Not authenticated' };

  let response: Response;
  try {
    response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/agents/download/${platform}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch {
    return { success: false, error: 'Network error while contacting BuboIQ.' };
  }

  if (response.status === 401) {
    return { success: false, error: 'Your session has expired. Please sign in again.' };
  }
  if (response.status === 403) {
    return { success: false, error: 'You do not have permission to download an installer.' };
  }
  if (!response.ok) {
    return { success: false, error: 'Failed to generate installer. Please try again.' };
  }

  const contentType = response.headers.get('Content-Type') || '';
  if (!contentType.includes('zip')) {
    return { success: false, error: 'Unexpected response from server.' };
  }

  const blob = await response.blob();
  if (!blob.size) return { success: false, error: 'Installer download was empty.' };

  let filename = `BuboIQ-Agent-Setup-${platform}.zip`;
  const disposition = response.headers.get('Content-Disposition');
  const match = disposition?.match(/filename="?([^";]+)"?/);
  if (match?.[1]) filename = match[1];

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);

  return { success: true, filename };
}
