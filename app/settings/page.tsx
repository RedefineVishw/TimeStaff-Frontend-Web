"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useSettings, useUpdateSettings } from "@/lib/queries";

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [minutes, setMinutes] = useState(5);

  // Sync the slider to whatever's actually saved once it loads, rather than
  // always starting from a hardcoded default.
  useEffect(() => {
    if (settings) setMinutes(settings.idleTimeoutMinutes);
  }, [settings]);

  function handleSave() {
    updateSettings.mutate(minutes, {
      onSuccess: () => toast.success("Idle timeout saved"),
      onError: () => toast.error("Couldn't save settings"),
    });
  }

  const isDirty = settings ? minutes !== settings.idleTimeoutMinutes : false;

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <h2 className="font-medium">Settings</h2>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="mb-1 block text-sm font-medium">Idle timeout</label>
        <p className="mb-4 text-sm text-gray-500">
          If there&apos;s no keyboard or mouse activity for this long, the desktop app
          automatically stops the running timer and discards that idle stretch from the
          logged time.
        </p>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-20 text-right font-mono text-sm">
                {minutes} {minutes === 1 ? "minute" : "minutes"}
              </span>
            </div>
            <div className="mt-4">
              <Button onClick={handleSave} disabled={!isDirty || updateSettings.isPending}>
                Save
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
