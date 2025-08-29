<script lang="ts">
	import { PencilLine, LockOpen, Lock } from "@lucide/svelte";
    import { getNavigationContext } from "../navigationContext";
    import { getSelectedRuleContext } from "../selectedRuleContext";

	interface Props {
		id: string;
		name: string;
		enabled: boolean;
		dailyLimit: number | null;
		unlockCount: number;
		unlockDurationMin: number | null;
		pauseBeforeUnlockSec: number | null;
	}

	type Step = "idle" | "selecting_time" | "custom_time" | "confirming";

	let {
		id,
		name,
		enabled,
		dailyLimit,
		unlockCount,
		unlockDurationMin,
		pauseBeforeUnlockSec,
	}: Props = $props();

	const navigate = getNavigationContext();
	const selectedRule = getSelectedRuleContext();

	let currentStep = $state<Step>("idle");

	let customMinutes = $state(10);
	let confirmationCountdown = $state(pauseBeforeUnlockSec ?? 0);

	const isLocked = $derived(dailyLimit ? unlockCount >= dailyLimit : false);
	const canConfirm = $derived(confirmationCountdown <= 0);

	function handleUnlockClick() {
		if (currentStep != "idle") {
			handleCancel();
			return;
		}

		if (unlockDurationMin) {
			currentStep = "confirming";
		} else {
			currentStep = "selecting_time";
		}
	}

	function handleTimeSelect() {
		currentStep = "confirming";
	}

	function handleCancel() {
		currentStep = "idle";
		confirmationCountdown = pauseBeforeUnlockSec ?? 0;
	}

	function handleConfirmYes() {
		console.log(`Unlocked ${name}.`);
		handleCancel();
		// TODO
	}

	function navigateToRuleForm(id: string) {
		selectedRule.id = id;
        navigate("rule_form");
    }

	$effect(() => {
		let interval: number | undefined;

		if (
			currentStep === "confirming" &&
			pauseBeforeUnlockSec &&
			pauseBeforeUnlockSec > 0
		) {
			interval = window.setInterval(() => {
				confirmationCountdown -= 1;
				if (confirmationCountdown <= 0) {
					window.clearInterval(interval);
				}
			}, 1000);
		}

		return () => {
			if (interval) {
				window.clearInterval(interval);
			}
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
			<span>{name}</span>
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
			<button class="cursor-pointer" title="Edit {name}" onclick={() => navigateToRuleForm(id)}>
				<PencilLine class="hover:text-gray-400" size={16} />
			</button>
		</div>
	</div>

	{#if currentStep === "selecting_time"}
		<div class="flex items-center gap-2 bg-base-300 py-2 px-3">
			<span>Show for</span>
			<button
				class="btn btn-xs btn-soft hover:btn-warning"
				onclick={handleTimeSelect}>5 min</button
			>
			<button
				class="btn btn-xs btn-soft hover:btn-warning"
				onclick={handleTimeSelect}>10 min</button
			>
			<button
				class="btn btn-xs btn-soft hover:btn-warning"
				onclick={handleTimeSelect}>15 min</button
			>
			<button
				class="btn btn-xs btn-soft hover:btn-error"
				onclick={() => (currentStep = "custom_time")}
			>
				Custom
			</button>
		</div>
	{/if}

	{#if currentStep === "custom_time"}
		<div class="flex items-center justify-between bg-base-300 py-2 px-3">
			<div class="flex items-center gap-2">
				<span>Show for</span>
				<input
					type="number"
					class="input input-sm w-16"
					bind:value={customMinutes}
				/>
				<span>min</span>
			</div>
			<div>
				<button class="btn btn-xs btn-soft" onclick={handleCancel}
					>Cancel</button
				>
				<button
					class="btn btn-xs btn-soft btn-error"
					onclick={handleTimeSelect}>Confirm</button
				>
			</div>
		</div>
	{/if}

	{#if currentStep === "confirming"}
		<div class="flex items-center justify-between bg-base-300 py-2 px-3">
			<span>Are you sure?</span>
			<div class="flex items-center gap-4">
				{#if pauseBeforeUnlockSec}
					<span class="text-xs">
						{confirmationCountdown > 0
							? `${confirmationCountdown} seconds left`
							: ""}
					</span>
				{/if}
				<div class="flex gap-2">
					<button
						class="btn btn-xs btn-soft btn-primary"
						onclick={handleCancel}>No</button
					>
					<button
						class="btn btn-xs btn-soft btn-error"
						disabled={!canConfirm}
						onclick={handleConfirmYes}
					>
						Yes
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
