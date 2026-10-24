// plain functions instead of EJS: EJS compiles with new Function, which Cloudflare Workers forbids
const e = require("./escape.js");

module.exports = data => `<h2>Cliente</h2>
<a href="#" onclick="javascript:window.history.back();">voltar</a>
<table>
	<tr>
		<td>Nome:</td>
		<td>${e(data.name)}</td>
	</tr>
	<tr>
		<td>Email:</td>
		<td>${e(data.email)}</td>
	</tr>
	<tr>
		<td>Cartão:</td>
		<td>${e(data.numero_cartao)}</td>
	</tr>
	<tr>
		<td>vencimento:</td>
		<td>${e(data.data_expiracao)}</td>
	</tr>
	<tr>
		<td>CCV:</td>
		<td>${e(data.ccv)}</td>
	</tr>
	<tr>
		<td>Nome no cartão:</td>
		<td>${e(data.nome_do_cartao)}</td>
	</tr>
</table>`;
