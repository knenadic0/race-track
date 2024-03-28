type MutatorOptions<Data = unknown, MutationData = Data> = {
	revalidate?: boolean;
	populateCache?: boolean | ((result: MutationData, currentData: Data | undefined) => Data);
	optimisticData?: Data | ((currentData: Data | undefined, displayedData: Data | undefined) => Data);
	rollbackOnError?: boolean | ((error: unknown) => boolean);
	throwOnError?: boolean;
};
type MutatorCallback<Data = unknown> = (currentData?: Data) => Promise<undefined | Data> | undefined | Data;

export type KeyedMutator<Data> = <MutationData = Data>(
	data?: Data | Promise<Data | undefined> | MutatorCallback<Data>,
	opts?: boolean | MutatorOptions<Data, MutationData>,
) => Promise<Data | MutationData | undefined>;
