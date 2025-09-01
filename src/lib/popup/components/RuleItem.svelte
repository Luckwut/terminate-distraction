<script lang="ts">
	import { PencilLine, LockOpen, Lock } from "@lucide/svelte";
	import { getRouterContext } from "@/lib/popup/router";

	interface Props {
		id: string;
		name: string;
		enabled: boolean;
		dailyLimit: number;
		unlockCount: number;
		unlockDurationMinute: number;
		pauseBeforeUnlockSecond: number;
	}

	let {
		id,
		name,
		enabled,
		dailyLimit,
		unlockCount,
		unlockDurationMinute,
		pauseBeforeUnlockSecond,
	}: Props = $props();

	const { navigate } = getRouterContext();

	type UnlockStep =
		| "idle"
		| "selectingDuration"
		| "customDuration"
		| "confirming";
	let currentStep = $state<UnlockStep>("idle");

	let customMinutesInput = $state(10);
	let selectedUnlockDurationMinute = $state(unlockDurationMinute);
	let confirmationCountdown = $state(pauseBeforeUnlockSecond);

	const isLocked = $derived(dailyLimit > 0 && unlockCount >= dailyLimit);
	const canConfirm = $derived(confirmationCountdown <= 0);

	function goToEditRuleForm() {
		navigate("ruleForm", { id });
	}

	function resetToIdle() {
		currentStep = "idle";
		confirmationCountdown = pauseBeforeUnlockSecond;
	}

	function handleUnlockClick() {
		if (currentStep !== "idle") {
			resetToIdle();
			return;
		}

		if (unlockDurationMinute > 0) {
			selectedUnlockDurationMinute = unlockDurationMinute;
			currentStep = "confirming";
		} else {
			currentStep = "selectingDuration";
		}
	}

	function selectDuration(minutes: number) {
		selectedUnlockDurationMinute = minutes;
		currentStep = "confirming";
	}

	function confirmUnlock() {
		console.log(
			`Unlocking "${name}" for ${selectedUnlockDurationMinute} minutes.`,
		);
		resetToIdle();
	}

	$effect(() => {
		if (currentStep !== "confirming" || pauseBeforeUnlockSecond <= 0) {
			return;
		}

		const interval = setInterval(() => {
			confirmationCountdown -= 1;
		}, 1000);

		if (confirmationCountdown <= 0) {
			clearInterval(interval);
		}

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="bg-base-200">
	<div class="flex justify-between items-center py-1 px-3">
		<span class="flex gap-2">
			{#if enabled}
				<span
					class="font-semibold
					{isLocked ? 'text-red-600' : 'text-green-600'}"
				>
					{unlockCount}/{dailyLimit}
				</span>
			{/if}
			<span class="truncate w-48" title={name}>{name}</span>
		</span>

		<div class="flex items-center gap-2">
			{#if enabled}
				<button
					class={isLocked ? "cursor-not-allowed" : "cursor-pointer"}
					onclick={handleUnlockClick}
					disabled={isLocked}
					title="Unlock {name}"
				>
					{#if isLocked}
						<Lock class="text-red-500" size={16} />
					{:else}
						<LockOpen class="hover:text-gray-400" size={16} />
					{/if}
				</button>
			{/if}
			<button
				class="cursor-pointer"
				title="Edit {name}"
				onclick={goToEditRuleForm}
			>
				<PencilLine class="hover:text-gray-400" size={16} />
			</button>
		</div>
	</div>

	{#if currentStep === "selectingDuration"}
		<div class="flex items-center gap-2 bg-base-300 py-2 px-3">
			<span>Unlock for</span>
			<button
				class="btn btn-xs btn-soft hover:btn-warning"
				onclick={() => selectDuration(5)}
			>
				5 min
			</button>
			<button
				class="btn btn-xs btn-soft hover:btn-warning"
				onclick={() => selectDuration(10)}
			>
				10 min
			</button>
			<button
				class="btn btn-xs btn-soft hover:btn-warning"
				onclick={() => selectDuration(15)}
			>
				15 min
			</button>
			<button
				class="btn btn-xs btn-soft hover:btn-error"
				onclick={() => (currentStep = "customDuration")}
			>
				Custom
			</button>
		</div>
	{/if}

	{#if currentStep === "customDuration"}
		<div class="flex items-center justify-between bg-base-300 py-2 px-3">
			<div class="flex items-center gap-2">
				<span>Unlock for</span>
				<input
					type="number"
					class="input input-sm w-16"
					placeholder="Minutes"
					min="1"
					bind:value={customMinutesInput}
				/>
				<span>min</span>
			</div>
			<div>
				<button
					class="btn btn-xs btn-soft hover:btn-primary"
					onclick={resetToIdle}
				>
					Cancel
				</button>
				<button
					class="btn btn-xs btn-soft btn-error"
					onclick={() => selectDuration(customMinutesInput)}
				>
					Confirm
				</button>
			</div>
		</div>
	{/if}

	{#if currentStep === "confirming"}
		<div class="flex items-center justify-between bg-base-300 py-2 px-3">
			<span>Are you sure?</span>
			<div class="flex items-center gap-4">
				{#if pauseBeforeUnlockSecond > 0 && confirmationCountdown > 0}
					<span class="text-xs tabular-nums">
						Wait {confirmationCountdown}s
					</span>
				{/if}
				<div class="flex gap-2">
					<button
						class="btn btn-xs btn-soft btn-primary"
						onclick={resetToIdle}
					>
						No
					</button>
					<button
						class="btn btn-xs btn-error"
						disabled={!canConfirm}
						onclick={confirmUnlock}
					>
						Yes
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
