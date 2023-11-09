// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Serpro is ERC1155 {
    constructor() ERC1155("") {}

    struct Pessoa {
        uint256 id;
        string nome;
        string email;
        string cpf;
    }

    mapping(uint => Pessoa) private pessoas;
    uint256[] private pessoaIds;
     uint256 private pessoaId  = 0;


     function setPessoa(
        string memory _nome,
        string memory _email,
        string memory _cpf
        ) public { 
        pessoaId++;
        Pessoa memory newPessoa = Pessoa({
            id: pessoaId,
            nome: _nome,
            email : _email,
            cpf : _cpf
        });
        pessoaIds.push(newPessoa.id);
        pessoas[newPessoa.id] = newPessoa; 
    }

    function updatePessoa(
            uint256 id,
            string memory _nome,
            string memory _email,
            string memory _cpf
    ) public
    {
            Pessoa storage targetPessoa = pessoas[id];
            targetPessoa.nome = _nome;
            targetPessoa.email = _email;
            targetPessoa.cpf = _cpf;
    }

    function deletePessoa(uint256 id) public {
        delete pessoas[id];
    }

    function getPessoaByID(uint256 id)  public view returns(
            uint256,
            string memory,
            string memory,
            string memory
    )
    {
        Pessoa memory pessoa = pessoas[id];

        return(
            pessoa.id,
            pessoa.nome,
            pessoa.email,
            pessoa.cpf
        );
    }

    function getItemsPessoa() public view returns (Pessoa[] memory){
        uint total_ids = pessoaIds.length + 1;

        Pessoa[] memory irs = new Pessoa[](total_ids);

        for(uint i=0;i<total_ids;i++){
            irs[i] = pessoas[i];
        }
        return irs;
    }

}