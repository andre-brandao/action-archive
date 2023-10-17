import type { ActionReturn } from '../../internal/svelte.js';
import type { ClipboardEvents, ClipboardParameters } from './types.js';
import { emit } from '../../internal/emit.js';

export function clipboard(
	node: HTMLElement,
	params: ClipboardParameters
): ActionReturn<ClipboardParameters, ClipboardEvents> {
	function clickHandler() {
		if (!navigator.clipboard) {
			console.warn(
				'Clipboard API not supported, see: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard'
			);
			return;
		}
		if (typeof params.value === 'string') navigator.clipboard.writeText(params.value);
		if (params.value instanceof Blob)
			navigator.clipboard.write([new ClipboardItem({ [params.value.type]: params.value })]);
		emit(node, 'copy', { value: params.value });
	}

	function init() {
		node.addEventListener('click', clickHandler);
	}

	function update(newParams: ClipboardParameters) {
		params = newParams;
	}

	function destroy() {
		node.removeEventListener('click', clickHandler);
	}

	init();
	update(params);

	return { update, destroy };
}
