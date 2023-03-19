export const ATTRIBUTES = ["toxicity", "severe_toxicity", "identity_attack", "insult", "threat", "profanity", "sexually_explicit"];
export const ACTIONS = ["NOOP", "NOTIFY", "MUTE", "KICK", "BAN"];
export const DEFAULT_MUTE_PERIOD = 60 * 60 * 1000;

export const buildStringChoice = (choiceName: string, choiceValue: string) => {
    return {
        name: choiceName,
        value: choiceValue
    }
}

export const buildIntegerChoice = (choiceName: string, choiceValue: number) => {
    return {
        name: choiceName,
        value: choiceValue
    }
}