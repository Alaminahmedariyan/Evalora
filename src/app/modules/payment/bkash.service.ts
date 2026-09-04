import { StatusCodes } from "http-status-codes";

import config from "../../config";
import AppError from "../../errors/appError";
import { getBkashIdToken } from "../../../lib/bkash";

type CreateBkashPaymentInput = {
	amount: number;
	invoiceNumber: string;
	callbackUrl?: string;
};

const getBkashHeaders = async (): Promise<Record<string, string>> => ({
	"Content-Type": "application/json",
	Accept: "application/json",
	Authorization: await getBkashIdToken(),
	"X-App-Key": config.bkash.appKey ?? "",
});

export const createBkashPayment = async (
	input: CreateBkashPaymentInput,
) => {
	const response = await fetch(
		`${config.bkash.baseUrl}/tokenized/checkout/create`,
		{
			method: "POST",
			headers: await getBkashHeaders(),
			body: JSON.stringify({
				mode: "0011",
				payerReference: input.invoiceNumber,
				callbackURL:
					input.callbackUrl ?? config.bkash.callbackUrl,
				amount: input.amount.toString(),
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber: input.invoiceNumber,
			}),
		},
	);

	if (!response.ok) {
		throw new AppError(
			StatusCodes.BAD_GATEWAY,
			"bKash payment creation failed.",
		);
	}

	return response.json();
};

export const executeBkashPayment = async (paymentID: string) => {
	const response = await fetch(
		`${config.bkash.baseUrl}/tokenized/checkout/execute`,
		{
			method: "POST",
			headers: await getBkashHeaders(),
			body: JSON.stringify({
				paymentID,
			}),
		},
	);

	if (!response.ok) {
		throw new AppError(
			StatusCodes.BAD_GATEWAY,
			"bKash payment execution failed.",
		);
	}

	return response.json();
};

export const queryBkashPayment = async (paymentID: string) => {
	const response = await fetch(
		`${config.bkash.baseUrl}/tokenized/checkout/payment/status`,
		{
			method: "POST",
			headers: await getBkashHeaders(),
			body: JSON.stringify({
				paymentID,
			}),
		},
	);

	if (!response.ok) {
		throw new AppError(
			StatusCodes.BAD_GATEWAY,
			"bKash payment query failed.",
		);
	}

	return response.json();
};