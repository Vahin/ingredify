UPDATE "MeasurementUnit"
SET "round_to_integer" = true
WHERE "short_name" IN ('ч. л.', 'ст. л.');
