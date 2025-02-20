"use client";

import { useState } from "react";

import { api } from "@/trpc/react";

export function LatestUrl() {
  const [latestUrl] = api.url.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [url, setUrl] = useState("");
  const createUrl = api.url.createGeneric.useMutation({
    onSuccess: async () => {
      await utils.url.invalidate();
      setUrl("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestUrl ? (
        <p className="truncate">
          Your most recent url: {latestUrl.destination}
        </p>
      ) : (
        <p>You have no urls yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUrl.mutate({ source: url });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        {createUrl.error && (
          <p>{createUrl.error.data?.zodError?.fieldErrors.source}</p>
        )}
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createUrl.isPending}
        >
          {createUrl.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
