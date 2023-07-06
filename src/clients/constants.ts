export const ATTRIBUTES = ["toxicity", "severe_toxicity", "identity_attack", "insult", "threat", "profanity", "sexually_explicit"];
export const ACTIONS = ["NOOP", "NOTIFY", "MUTE", "KICK", "BAN"];
export const DEFAULT_MUTE_PERIOD = 60 * 60 * 1000;

export const ATTR_PRETTY = {
    crime_coefficient_100: "Crime Coefficient 100",
    crime_coefficient_300: "Crime Coefficient 300",
    toxicity: "Toxicity",
    severe_toxicity: "Severe Toxicity",
    identity_attack: "Identity Attack",
    insult: "Insult",
    threat: "Threat",
    profanity: "Profanity",
    sexually_explicit: "Sexually Explicit"
};

export const ACTION_PRETTY = {
    NOOP: "None",
    NOTIFY: "Notify",
    MUTE: "Mute",
    KICK: "Kick",
    BAN: "Ban"
};

export function buildStringChoice(choiceName: string, choiceValue: string) {
    return {
        name: choiceName,
        value: choiceValue
    };
}

export function buildIntegerChoice(choiceName: string, choiceValue: number) {
    return {
        name: choiceName,
        value: choiceValue
    };
}

export type Reason = {
    attribute: string
    score: number
    threshold: number
};
