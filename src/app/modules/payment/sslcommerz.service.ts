import { StatusCodes } from "http-status-codes";

import config from "../../config";
import AppError from "../../errors/appError";
import { sslcommerz } from "../../../lib/sslcommerz";

type InitSslcommerzPaymentInput = {
	amount: number;
	transactionId: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	productName: string;
};

export const initSslcommerzPayment = async (
	input: InitSslcommerzPaymentInput,
) => {
	if (
		!config.sslcommerz.storeId ||
		!config.sslcommerz.storePassword
	) {
		throw new AppError(
			StatusCodes.SERVICE_UNAVAILABLE,
			"SSLCommerz is not configured.",
		);
	}

	return sslcommerz.init({
		total_amount: input.amount,
		currency: "BDT",
		tran_id: input.transactionId,

		success_url: `${config.app.clientUrl}/payment/success`,
		fail_url: `${config.app.clientUrl}/payment/fail`,
		cancel_url: `${config.app.clientUrl}/payment/cancel`,
		ipn_url: `${config.app.clientUrl}/api/v1/webhooks/sslcommerz`,

		shipping_method: "NO",

		product_name: input.productName,
		product_category: "General",
		product_profile: "general",

		cus_name: input.customerName,
		cus_email: input.customerEmail,
		cus_phone: input.customerPhone,

		cus_add1: "N/A",
		cus_city: "N/A",
		cus_country: "Bangladesh",
	});
};

export const validateSslcommerzPayment = async (
	valId: string,
) => {
	return sslcommerz.validate({
		val_id: valId,
	});
};